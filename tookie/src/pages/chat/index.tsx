import { useState, useEffect } from 'react';
import { Input, Layout, List, Avatar } from 'antd';
import styled from 'styled-components';
import sendButtonDark from '/src/assets/sendButtonDark.png';
import sendButtonLight from '/src/assets/sendButtonLight.png';
import { beginnerQuestions, intermediateQuestions, advancedQuestions, Question } from './questions';

const { Content } = Layout;
const { TextArea } = Input;

const initialMessages: Message[] = [];

interface Message {
    id: number;
    sender: 'user' | 'bot';
    content: string;
}

export const Chat = () => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [eventSource, setEventSource] = useState<EventSource | null>(null);
    const [partialMessage, setPartialMessage] = useState<string>('');
    const [isChatEnd, setIsChatEnd] = useState(false);
    const [showWelcomeScreen, setShowWelcomeScreen] = useState(true); // 추가된 상태
    const [recommendedQuestions, setRecommendedQuestions] = useState<Question[]>([]);

    useEffect(() => {
        // 추천 질문 랜덤으로 선택
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
        // 컴포넌트 언마운트 시 SSE 연결 종료
        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [eventSource]);

    useEffect(() => {
        // partialMessage가 업데이트되고 비어 있을 때, 전체 메시지를 목록에 추가
        if (!isChatEnd) return;

        // 전체 메시지로 봇 메시지 생성
        const botMessage: Message = {
            id: messages.length + 1,
            sender: 'bot',
            content: partialMessage,
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setPartialMessage(''); // 메시지 목록에 추가 후 partialMessage 초기화
        setIsChatEnd(false);
    }, [isChatEnd]);

    const handleSend = async () => {
        if (input.trim()) {
            setShowWelcomeScreen(false); // 환영 화면 숨기기

            const userMessage: Message = {
                id: messages.length + 1,
                sender: 'user',
                content: input,
            };
            setMessages([...messages, userMessage]);
            setInput('');

            // 사용자 메시지를 백엔드로 전송
            try {
                const response = await fetch('http://172.30.1.92:3000/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Accept': 'application/json; charset=utf-8',
                    },
                    body: JSON.stringify({
                        user_id: "1",
                        user_level: 1,
                        user_chat: input,
                    }),
                });

                if (response.ok) {
                    // POST 요청이 성공하면 SSE에 연결
                    connectSSE();
                } else {
                    console.error('메시지 전송 실패:', response.status);
                }
            } catch (error) {
                console.error('메시지 전송 중 오류 발생:', error);
            }
        }
    };

    const connectSSE = () => {
        if (eventSource) {
            eventSource.close();
        }

        const source = new EventSource('http://172.30.1.92:3000/chat/stream/1');
        setEventSource(source);

        source.onmessage = (event) => {
            const data = event.data.trim();
            // 수신된 데이터 조각을 partialMessage에 추가
            setPartialMessage((prev) => prev + " " + data);
            // 데이터 조각이 비어 있으면 메시지의 끝을 나타냄
            if (data === '') {
                setIsChatEnd(true);
            }
        };

        source.onerror = (error) => {
            console.error('EventSource 오류:', error);
            source.close();
        };
    };

    const handleStartChat = (question: Question) => {
        setShowWelcomeScreen(false); // 환영 화면 숨기기

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
