import React, { useState, useEffect } from 'react';
import { Button, Input, Layout, List, Avatar } from 'antd';
import styled from 'styled-components';

const { Content } = Layout;
const { TextArea } = Input;

const initialMessages = [
    {
        id: 1,
        sender: 'bot',
        content: '안녕하세요! 무엇을 도와드릴까요?',
    },
];

interface Message {
    id: number;
    sender: 'user' | 'bot';
    content: string;
}

export const Chat = () => {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const [eventSource, setEventSource] = useState<EventSource | null>(null);
    const [partialMessage, setPartialMessage] = useState<string>('');
    const [isChatEnd, setIsChatEnd] = useState(false);

    useEffect(() => {
        // Clean up SSE connection when component unmounts
        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [eventSource]);

    useEffect(() => {
        // When partialMessage is updated and is empty, add the complete message to the list
        if (!isChatEnd) return;

        // Create a bot message with the complete message
        const botMessage: Message = {
            id: messages.length + 1,
            sender: 'bot',
            content: partialMessage,
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setPartialMessage(''); // Reset partial message after adding to messages
        setIsChatEnd(false);
    }, [isChatEnd]);


    const handleSend = async () => {
        if (input.trim()) {
            const userMessage = {
                id: messages.length + 1,
                sender: 'user',
                content: input,
            };
            setMessages([...messages, userMessage]);
            setInput('');

            // Send user message to backend
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
                    // Only connect to SSE if POST request was successful
                    connectSSE();
                } else {
                    console.error('Failed to send message:', response.status);
                }
            } catch (error) {
                console.error('Error sending message:', error);
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
            // Append the received data chunk to the partial message
            setPartialMessage((prev) => prev + " " + data);
            // If the data chunk is empty, it indicates the end of a message
            if (data === '') {
                setIsChatEnd(true);
            }
        };

        source.onerror = (error) => {
            console.error('EventSource error:', error);
            source.close();
        };
    };

    return (
        <Content style={{ padding: '20px 50px' }}>
            <Container>
                <ChatContainer>
                    <List
                        dataSource={messages}
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar>{item.sender === 'bot' ? 'B' : 'U'}</Avatar>}
                                    title={item.sender === 'bot' ? 'Bot' : 'User'}
                                    description={item.content}
                                />
                            </List.Item>
                        )}
                    />
                </ChatContainer>
                <InputContainer>
                    <StyledTextArea
                        rows={2}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onPressEnter={handleSend}
                    />
                    <Button type="primary" onClick={handleSend}>전송</Button>
                </InputContainer>
            </Container>
        </Content>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 20px;
`;

const ChatContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 20px;
`;

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 20px;
`;

const StyledTextArea = styled(TextArea)`
    margin-right: 10px;
    flex: 1;
`;
