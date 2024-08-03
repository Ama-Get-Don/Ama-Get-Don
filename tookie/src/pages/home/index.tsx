import React from 'react';
import styled from 'styled-components';
import { Button as AntButton } from 'antd';
import backgroundImage from '../../assets/homepage.png';

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


export const HomePage: React.FC = () => {
  return (
    <HomeContainer>
      <ButtonContainer>
        <StyledButton type="default" onClick={() => console.log('회원가입')}>회원가입</StyledButton>
        <StyledButton type="default" onClick={() => console.log('로그인')}>로그인</StyledButton>
      </ButtonContainer>
    </HomeContainer>
  );
};

export default HomePage;