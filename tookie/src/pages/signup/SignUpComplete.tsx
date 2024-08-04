import { Button } from 'antd';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';

export const SignUpComplete = () => {
  const navigate = useNavigate();

  const handleChat = () => {
    navigate('/chat');
  };

  return (
    <Container>
      <h1>회원가입이 완료되었습니다!</h1>
      <StyledButton type="primary" onClick={handleChat}>
        AI챗봇과 대화하기 
      </StyledButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
  width: 200px;
  font-size: 16px;
`;

export default SignUpComplete;
