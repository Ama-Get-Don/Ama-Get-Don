import { Button } from 'antd';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import SeedlingImage from '/src/assets/seed.png'; 
import { useGlobalState } from '../../GlobalState.tsx';  

export const SignUpComplete = () => {
  const navigate = useNavigate();
  const { user_create } = useGlobalState();  


  const userName = user_create.name || '사용자'; // 사용자 이름
  const investmentLevel = user_create.investment_level || 1; // 투자 단계 (기본값 1)
  
  // 투자 단계에 따른 명칭 설정
  const investmentStageName = investmentLevel === 1 ? '씨앗' 
                        : investmentLevel === 2 ? '새순' 
                        : '투키';


  const handleLogin = () => {
    navigate('/sign-in');
  };

  return (
    <Container>
      <SeedlingWrapper>
        <Seedling src={SeedlingImage} alt="Seedling" />
      </SeedlingWrapper>
      <Title>회원가입 완료!</Title>
      <Description>
        {userName}님은 ‘{investmentStageName}’ 단계입니다.
        <br />
        투키와 함께 주식 투자 능력을 키워봐요!
        <br />
        <SmallText>(내 정보 설정 창에서 성장 단계를 직접 변경할 수 있어요)</SmallText>
      </Description>
      <StyledButton onClick={handleLogin}>
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
