import React from 'react';
import styled from 'styled-components';
import { Button as AntButton } from 'antd';
import backgroundImage from '../../assets/homepage.png';
import { useNavigate } from 'react-router-dom';


export const HomePage: React.FC = () => {
  const navigate = useNavigate(); // useNavigate를 여기서 호출합니다.

  const handleSignUp = () => {
    navigate('/sign-up/terms');
  };

  const handleLogin = () => {
    navigate('/sign-in');
  };

  return (
    <HomeContainer>
      <ButtonContainer>
        <StyledButton type="default" shape="round" onClick={handleSignUp}>회원가입</StyledButton>
        <StyledButton type="default" shape="round" onClick={handleLogin}>로그인</StyledButton>
      </ButtonContainer>
    </HomeContainer>
  );
};

export default HomePage;

const HomeContainer = styled.div`
  display: flex;
  align-items: flex-end;
  min-height: 100vh;
  width: 100%;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: flex-start;
  margin-left: 100px;
  margin-bottom: 300px;  // 버튼을 화면 하단에서 약간 띄웁니다.
`;

const StyledButton = styled(AntButton)`
  font-size: 18px;
  height: 40px;
  padding: 0 30px;
  color: black;
  background-color: white;
  border-color: white;
`;