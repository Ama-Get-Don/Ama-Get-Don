import { Button } from 'antd';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import SeedlingImage from '/src/images/seed.png'; 

export const SignUpComplete = () => {
  const navigate = useNavigate();

  const handleChat = () => {
    navigate('/chat');
  };

  return (
    <Container>
      <SeedlingWrapper>
        <Seedling src={SeedlingImage} alt="Seedling" />
      </SeedlingWrapper>
      <Title>회원가입 완료!</Title>
      <Description>
        김주식님은 ‘씨앗’ 단계입니다.
        <br />
        투키와 함께 주식 투자 능력을 키워봐요!
        <br />
        <SmallText>(내 정보 설정 창에서 성장 단계를 직접 변경할 수 있어요)</SmallText>
      </Description>
      <StyledButton onClick={handleChat}>
        대화 시작하기
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
  background-color: white;
  padding: 20px;
  font-family: 'Pretendard', sans-serif;
`;

const SeedlingWrapper = styled.div`
  background-color: #6ddd89;
  border-radius: 50%;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const Seedling = styled.img`
  width: 150px;
  height: 150px;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 20px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const SmallText = styled.span`
  font-size: 14px;
  color: #999;
`;

const StyledButton = styled(Button)`
  background-color: #6ddd89 !important;
  border-color: #6ddd89 !important;
  color: white !important;
  margin-top: 20px;
  width: 200px;
  font-size: 16px !important;

  &:hover {
    background-color: #00D282 !important;
    border-color: #00D282 !important;
    color: white !important;
  }
`;

export default SignUpComplete;
