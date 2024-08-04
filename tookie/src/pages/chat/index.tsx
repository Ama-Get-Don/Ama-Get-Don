import { styled } from "styled-components";
import { Button, Input, Layout, List, Avatar } from 'antd';
import { useState } from "react";

const { Content } = Layout;
const { TextArea } = Input;

const messagesInitialState = [
    {
        id: 1,
        sender: 'bot',
        content: '안녕하세요! 무엇을 도와드릴까요?',
    },
];

export const Chat = () => {
    const [messages, setMessages] = useState(messagesInitialState);
    const [input, setInput] = useState('');

    const handleSend = async () => {
        if (input.trim()) {
            const userMessage = {
                id: messages.length + 1,
                sender: 'user',
                content: input,
            };
            setMessages([...messages, userMessage]);
            setInput('');

            // TODO: Backend API 호출
            const response = "response from api"

            const botMessage = {
                id: messages.length + 2,
                sender: 'bot',
                content: response,
            };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        }
    };


    return (
        <>
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
        </>
    )
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
