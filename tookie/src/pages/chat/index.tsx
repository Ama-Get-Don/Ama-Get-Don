import React, { useState, useEffect } from 'react';
import { Input, Layout, List, Avatar } from 'antd';
import styled from 'styled-components';
import sendButtonDark from '/src/assets/sendButtonDark.png';
import sendButtonLight from '/src/assets/sendButtonLight.png';
import { beginnerQuestions, intermediateQuestions, advancedQuestions, Question } from './questions';
import { useGlobalState } from '../../GlobalState.tsx'; 

const { Content } = Layout;
const { TextArea } = Input;

const initialMessages: Message[] = [];

interface Message {
    id: number;
    sender: 'user' | 'bot';
    content: string;
}

export const Chat = () => {
    const { user_create, user_id } = useGlobalState(); 
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [eventSource, setEventSource] = useState<EventSource | null>(null);
    const [partialMessage, setPartialMessage] = useState<string>('');
    const [isChatEnd, setIsChatEnd] = useState(false);
    const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
    const [recommendedQuestions, setRecommendedQuestions] = useState<Question[]>([]);

    useEffect(() => {
        const getRandomQuestions = (questions: Question[], num: number) => {
            return questions.sort(() => 0.5 - Math.random()).slice(0, num);
        };

        setRecommendedQuestions([
            ...getRandomQuestions(beginnerQuestions, 1),
            ...getRandomQuestions(intermediateQuestions, 1),
            ...getRandomQuestions(advancedQuestions, 1),
        ]);
    }, []);

    useEffect(() => {
        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [eventSource]);

    useEffect(() => {
        if (!isChatEnd) return;

        const botMessage: Message = {
            id: messages.length + 1,
            sender: 'bot',
            content: partialMessage,
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setPartialMessage('');
        setIsChatEnd(false);
    }, [isChatEnd]);

    const handleSend = async () => {
        if (input.trim()) {
            setShowWelcomeScreen(false);

            const userMessage: Message = {
                id: messages.length + 1,
                sender: 'user',
                content: input,
            };
            setMessages([...messages, userMessage]);
            setInput('');

            if (!user_id) {
                console.error('User ID가 없습니다. 로그인을 확인해주세요.');
                return;
            }

            try {
                const response = await fetch('http://172.16.1.197:3000/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Accept': 'application/json; charset=utf-8',
                    },
                    body: JSON.stringify({
                        user_id: user_id,
                        investment_level: user_create.investment_level,
                        user_chat: input,
                    }),
                });

                if (response.ok) {
                    connectSSE();
                } else {
                    console.error('메시지 전송 실패:', response.status);
                }
            } catch (error) {
                console.error('메시지 전송 중 오류 발생:', error);
            }
        }
    };

    const handleStartChat = (question: Question) => {
        setShowWelcomeScreen(false);

        const userMessage: Message = {
            id: messages.length + 1,
            sender: 'user',
            content: question.content,
        };

        const botMessage: Message = {
            id: messages.length + 2,
            sender: 'bot',
            content: question.response,
        };

        setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);
    };

    const connectSSE = () => {
        if (eventSource) {
            eventSource.close();
        }

        if (!user_id) {
            console.error('User ID가 없습니다. 로그인을 확인해주세요.');
            return;
        }

        const source = new EventSource(`http://172.16.1.197:3000/chat/stream/${user_id}`);
        setEventSource(source);

        source.onmessage = (event) => {
            const data = event.data.trim();
            setPartialMessage((prev) => prev + " " + data);
            if (data === '') {
                setIsChatEnd(true);
            }
        };

        source.onerror = (error) => {
            console.error('EventSource 오류:', error);
            source.close();
        };
    };

    return (
        <Content style={{ padding: '20px 50px', height: '100vh' }}>
            <Container>
                <ChatContainer>
                    {showWelcomeScreen ? (
                        <WelcomeScreen>
                            <WelcomeContent>
                                <AvatarWrapper>
                                    <AvatarIcon />
                                </AvatarWrapper>
                                <WelcomeMessage>주식 관련 메시지를 입력하시거나, 아래 추천 질문을 클릭해주세요.</WelcomeMessage>
                                <ButtonWrapper>
                                    {recommendedQuestions.map((question) => (
                                        <QuestionButton key={question.id} onClick={() => handleStartChat(question)}>
                                            {question.content}
                                        </QuestionButton>
                                    ))}
                                </ButtonWrapper>
                            </WelcomeContent>
                        </WelcomeScreen>
                    ) : (
                        <List
                            dataSource={messages}
                            renderItem={(item) => (
                                <MessageItem key={item.id} sender={item.sender}>
                                    <MessageContent sender={item.sender}>
                                        <Avatar>{item.sender === 'bot' ? 'B' : 'U'}</Avatar>
                                        <MessageBubble sender={item.sender}>
                                            {item.content}
                                        </MessageBubble>
                                    </MessageContent>
                                </MessageItem>
                            )}
                        />
                    )}
                </ChatContainer>
                <InputWrapper>
                    <InputContainer>
                        <StyledTextArea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onPressEnter={handleSend}
                            placeholder="메시지를 입력하세요"
                            autoSize={{ minRows: 1, maxRows: 10 }} // autoSize 속성 추가
                        />
                        <StyledButton onClick={handleSend} />
                    </InputContainer>
                    <FooterText>증권 투자는 반드시 자기 자신의 판단과 책임 하에 하여야 하며, 자신의 여유 자금으로 분산 투자하는 것이 좋습니다.</FooterText>
                </InputWrapper>
            </Container>
        </Content>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 50px;
    max-width: 1000px;
    margin: 0 auto; 
`;

const ChatContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    margin-bottom: 20px;
`;

const WelcomeScreen = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
`;

const WelcomeContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const AvatarWrapper = styled.div`
    margin-bottom: 20px;
`;

const AvatarIcon = styled.div`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #f5f5f5;
`;

const WelcomeMessage = styled.div`
    font-size: 18px;
    margin-bottom: 20px;
`;

const ButtonWrapper = styled.div`
    display: flex;
    gap: 10px;
`;

const QuestionButton = styled.button`
    background-color: #e5f5e5;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;

    &:hover {
        background-color: #d4e4d4;
    }
`;

const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    max-width: 1300px; 
    width: 100%;
    border-radius: 20px;
    border: 1px solid #ddd;
    background-color: #f5f5f5;
    padding: 10px;
`;

const StyledTextArea = styled(TextArea)`
    flex: 1;
    border-radius: 20px;
    border: none;
    background-color: #f5f5f5;
    padding: 10px;
    resize: none;
    margin-right: 10px; 
    overflow: hidden; 
`;

const StyledButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    width: 40px;
    height: 40px;
    background-image: url(${sendButtonLight});
    background-size: cover;

    &:hover {
        background-image: url(${sendButtonDark});
    }
`;

const FooterText = styled.div`
    text-align: center;
    margin-top: 10px;
    color: #888;
    font-size: 12px;
`;

const MessageItem = styled.div<{ sender: 'user' | 'bot' }>`
    display: flex;
    justify-content: ${props => (props.sender === 'user' ? 'flex-end' : 'flex-start')};
    margin-bottom: 10px;
`;

const MessageContent = styled.div<{ sender: 'user' | 'bot' }>`
    display: flex;
    align-items: flex-start;
    flex-direction: ${props => (props.sender === 'user' ? 'row-reverse' : 'row')};
`;

const MessageBubble = styled.div<{ sender: 'user' | 'bot' }>`
    max-width: 100%;
    background-color: ${props => (props.sender === 'user' ? '#d4f7dc' : '#f1f0f0')};
    color: ${props => (props.sender === 'user' ? '#000' : '#000')};
    padding: 20px;
    border-radius: 10px;
    margin: 0 10px;
`;
