import React, { useState } from 'react';
import { Button, Col, Row, Input, Space } from "antd";
import styled from "styled-components";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import tookieSignIn from '../../assets/tookie_signin.png';

export const SignIn = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleChat = () => {
    if (username && password) {
      navigate('/chat');
    }
  };

  const isLoginDisabled = !username || !password;

  return (
    <Container>
      <LogoImage src={tookieSignIn} alt="Tookie Sign In" />
      <StyledInput 
        placeholder="아이디를 입력해주세요" 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Space direction="vertical" style={{ width: '300px', height: '6vh' }}>
        <Input.Password 
          style={{ height: '5vh' }}
          placeholder="비밀번호를 입력해주세요"
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Space>
      <StyledButton 
        type="primary" 
        shape="round" 
        onClick={handleChat}
        disabled={isLoginDisabled}
      >
        로그인
      </StyledButton>
      <Row>
        <Col>비밀번호 찾기</Col>
        <Col style={{ marginLeft: 10, marginRight: 10 }}>|</Col>
        <Col>아이디 찾기</Col>
      </Row>
    </Container>
  )
}

const LogoImage = styled.img`
  width: 200px;
  margin-bottom: 20px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
  padding: 20px;
`;

const StyledInput = styled(Input)`
  margin-bottom: 10px;
  width: 300px;
  height: 5vh;
`;

const StyledButton = styled(Button)`
  &&& {
    margin: 10px 0;
    width: 300px;
    font-size: 16px;
    background-color: #00D282;
    border-color: #00D282;
    color: white;

    &:hover, &:focus {
      background-color: #00B870;
      border-color: #00B870;
      color: white;
    }

    &:active {
      background-color: #009A5E;
      border-color: #009A5E;
    }

    &:disabled {
      background-color: #00D282;
      border-color: #00D282;
      color: white;
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
`;