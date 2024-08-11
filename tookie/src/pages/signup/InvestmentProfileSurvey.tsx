import React, { useState, useEffect, useCallback } from 'react';
import { Button as AntButton, Typography, Form } from 'antd';
import styled from 'styled-components';
import checkedImage from '../../assets/after_check.png';
import uncheckedImage from '../../assets/before_check.png';
import { useNavigate } from "react-router-dom";
import { useGlobalState } from '../../GlobalState.tsx';

const { Title } = Typography;

// koreanValues 객체를 컴포넌트 파일 내에 선언
const koreanValues = {
  lowRisk: '원금 보존 가능성을 포기하지 아닐길에 예적금 수익률 보다 1~2% 정도만 더 나오면 됨',
  moderateRisk: '예적금 수익률보다 3~5% 정도 기대할 수 있다면, 원금 보존 가능성은 조금 포기할 수 있음',
  highRisk: '고수익을 기대하고 있으며, 원금 손실 가능성을 감수할 수 있음',
  lowTolerance: '투자 원금은 반드시 보전',
  moderateTolerance: '약간의 손실 감수 가능',
  highTolerance: '높은 기대 수익을 위해 높은 위험 감수 가능',
  'lessThan10': '10% 미만',
  '10To30': '10% 이상 ~ 30% 미만',
  'moreThan30': '30% 이상',
  'lessThan1Year': '1년 미만',
  '1To5Years': '1년 이상 ~ 5년 미만',
  'moreThan5Years': '5년 이상',
  unstableIncome: '정기적 수입이 있으며, 향후 현재 수준의 유지 또는 증가가 예상됨',
  stableIncome: '정기적 수입이 있으나, 향후 감소 또는 불안정이 예상됨',
  noIncome: '현재 정기적 수입이 없음',
  '1To3Years': '1년 이상 ~ 3년 미만',
  'moreThan3Years': '3년 이상'
};

export const InvestmentProfileSurvey: React.FC = () => {
  const { user_create } = useGlobalState(); // 전역 상태에서 user_create만 직접 가져옴
  const [answers, setAnswers] = useState({
    investmentGoal: '',
    riskTolerance: '',
    investmentRatio: '',
    investmentPeriod: '',
    incomeSource: '',
    derivativeExperience: '',
  });
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const navigate = useNavigate();

  const handleCheckboxChange = (key: keyof typeof answers, value: keyof typeof koreanValues) => {
    setAnswers(prev => ({
      ...prev,
      [key]: prev[key] === koreanValues[value] ? '' : koreanValues[value],
    }));
  };

  const isAnswersValid = useCallback(() => {
    return Object.values(answers).every(answer => answer !== '');
  }, [answers]);

  const handleNext = async () => {
    if (isAnswersValid()) {
      try {
        const response = await fetch('http://172.16.1.197:3000/api/user/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_create: {
              ...user_create, 
            },
            investmentPreference_create: {
              investment_goal: answers.investmentGoal,
              risk_tolerance: answers.riskTolerance,
              investment_ratio: answers.investmentRatio,
              investment_period: answers.investmentPeriod,
              income_status: answers.incomeSource,
              derivatives_experience: answers.derivativeExperience,
            }
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json(); // 서버에서 반환한 구체적인 오류 메시지를 가져옴
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
        }
  
        navigate('/sign-up/complete');
      } catch (error) {
        console.error('Error saving investment profile:', error);
      }
    } else {
      console.error('Invalid answers');
    }
  };

  useEffect(() => {
    setIsButtonEnabled(isAnswersValid());
  }, [answers, isAnswersValid]);

  return (
    <Form
      layout="vertical"
      style={{ maxWidth: '750px', margin: '0 auto', padding: '20px' }}
    >
      <Title level={4} style={{ color: '#00D282' }}>
        투자자님의 투자 성향을 알아보기 위한 질문입니다! 아래 질문에 대답해 주세요.
      </Title>

      <Spacer />

      <Form.Item
        label={<span style={{ fontWeight: 'bold' }}>
          1. 주식 투자의 목표는 무엇인가요?
        </span>}>
        <QuestionBox>
          <CheckboxWrapper onClick={() => handleCheckboxChange('investmentGoal', 'lowRisk')}>
            <CheckboxImage
              src={answers.investmentGoal === koreanValues['lowRisk'] ? checkedImage : uncheckedImage}
              alt="checkbox"
            />
            <span>원금 보존 가능성을 포기하지 아닐길에 예적금 수익률 보다 1~2% 정도만 더 나오면 됨</span>
          </CheckboxWrapper>
        </QuestionBox>
        <QuestionBox>
          <CheckboxWrapper onClick={() => handleCheckboxChange('investmentGoal', 'moderateRisk')}>
            <CheckboxImage
              src={answers.investmentGoal === koreanValues['moderateRisk'] ? checkedImage : uncheckedImage}
              alt="checkbox"
            />
            <span>예적금 수익률보다 3~5% 정도 기대할 수 있다면, 원금 보존 가능성은 조금 포기할 수 있음</span>
          </CheckboxWrapper>
        </QuestionBox>
        <QuestionBox>
          <CheckboxWrapper onClick={() => handleCheckboxChange('investmentGoal', 'highRisk')}>
            <CheckboxImage
              src={answers.investmentGoal === koreanValues['highRisk'] ? checkedImage : uncheckedImage}
              alt="checkbox"
            />
            <span>고수익을 기대하고 있으며, 원금 손실 가능성을 감수할 수 있음</span>
          </CheckboxWrapper>
        </QuestionBox>
      </Form.Item>

      <Form.Item
        label={<span style={{ fontWeight: 'bold' }}>
          2. 투자에서 원금 손실을 감수할 수 있는 정도는 어느 정도인가요?
        </span>}>
        <QuestionBox>
          <CheckboxWrapper onClick={() => handleCheckboxChange('riskTolerance', 'lowTolerance')}>
            <CheckboxImage
              src={answers.riskTolerance === koreanValues['lowTolerance'] ? checkedImage : uncheckedImage}
              alt="checkbox"
            />
            <span>투자 원금은 반드시 보전</span>
          </CheckboxWrapper>
        </QuestionBox>
        <div>
        </div>
        <QuestionBox>
          <CheckboxWrapper onClick={() => handleCheckboxChange('riskTolerance', 'moderateTolerance')}>
            <CheckboxImage
              src={answers.riskTolerance === koreanValues['moderateTolerance'] ? checkedImage : uncheckedImage}
              alt="checkbox"
            />
            <span>약간의 손실 감수 가능</span>
          </CheckboxWrapper>
        </QuestionBox>
        <div>
        </div>
        <QuestionBox>
          <CheckboxWrapper onClick={() => handleCheckboxChange('riskTolerance', 'highTolerance')}>
            <CheckboxImage
              src={answers.riskTolerance === koreanValues['highTolerance'] ? checkedImage : uncheckedImage}
              alt="checkbox"
            />
            <span>높은 기대 수익을 위해 높은 위험 감수 가능</span>
          </CheckboxWrapper>
        </QuestionBox>
      </Form.Item>

      <Form.Item
        label={<span style={{ fontWeight: 'bold' }}>
          3. 주식에 투자하고자 하는 자금은 전체 금융 자산 중 어느 정도의 비중을 차지하나요?
        </span>}>
        <QuestionBox>
          <CheckboxWrapper onClick={() => handleCheckboxChange('investmentRatio', 'lessThan10')}>
            <CheckboxImage
              src={answers.investmentRatio === koreanValues['lessThan10'] ? checkedImage : uncheckedImage}
              alt="checkbox"
            />
            <span>10% 미만</span>
          </CheckboxWrapper>
        </QuestionBox>
        <div>
        </div>
        <QuestionBox>
          <CheckboxWrapper onClick={() => handleCheckboxChange('investmentRatio', '10To30')}>
            <CheckboxImage
              src={answers.investmentRatio === koreanValues['10To30'] ? checkedImage : uncheckedImage}
              alt="checkbox"
            />
            <span>10% 이상 ~ 30% 미만</span>
          </CheckboxWrapper>
        </QuestionBox>
        <div>
        </div>
        <QuestionBox>
          <CheckboxWrapper onClick={() => handleCheckboxChange('investmentRatio', 'moreThan30')}>
            <CheckboxImage
              src={answers.investmentRatio === koreanValues['moreThan30'] ? checkedImage : uncheckedImage}
              alt="checkbox"
            />
            <span>30% 이상</span>
          </CheckboxWrapper>
        </QuestionBox>
      </Form.Item>

      <Form.Item
        label={<span style={{ fontWeight: 'bold' }}>
          4. 어느 정도의 기간 동안 자금을 투자할 계획이신가요?
        </span>}>
        <QuestionBox>
          <CheckboxWrapper onClick={() => handleCheckboxChange('investmentPeriod', 'lessThan1Year')}>
            <CheckboxImage
              src={answers.investmentPeriod === koreanValues['lessThan1Year'] ? checkedImage : uncheckedImage}
              alt="checkbox"
            />
            <span>1년 미만</span>
          </CheckboxWrapper>
        </QuestionBox>
        <div>
        </div>
        <QuestionBox>
          <CheckboxWrapper onClick={() => handleCheckboxChange('investmentPeriod', '1To5Years')}>
            <CheckboxImage
              src={answers.investmentPeriod === koreanValues['1To5Years'] ? checkedImage : uncheckedImage}
              alt="checkbox"
            />
            <span>1년 이상 ~ 5년 미만</span>
          </CheckboxWrapper>
        </QuestionBox>
        <div>
        </div>
        <QuestionBox>
          <CheckboxWrapper onClick={() => handleCheckboxChange('investmentPeriod', 'moreThan5Years')}>
            <CheckboxImage
              src={answers.investmentPeriod === koreanValues['moreThan5Years'] ? checkedImage : uncheckedImage}
              alt="checkbox"
            />
            <span>5년 이상</span>
          </CheckboxWrapper>
        </QuestionBox>
      </Form.Item>

      <Form.Item
        label={<span style={{ fontWeight: 'bold' }}>
          5. 사용자님의 수입원을 가장 잘 나타내는 것은 어느 것인가요?
        </span>}>
        <QuestionBox>
          <CheckboxWrapper onClick={() => handleCheckboxChange('incomeSource', 'unstableIncome')}>
            <CheckboxImage
              src={answers.incomeSource === koreanValues['unstableIncome'] ? checkedImage : uncheckedImage}
              alt="checkbox"
            />
            <span>정기적 수입이 있으며, 향후 현재 수준의 유지 또는 증가가 예상됨</span>
          </CheckboxWrapper>
        </QuestionBox>
        <div>
        </div>
        <QuestionBox>
          <CheckboxWrapper onClick={() => handleCheckboxChange('incomeSource', 'stableIncome')}>
            <CheckboxImage
              src={answers.incomeSource === koreanValues['stableIncome'] ? checkedImage : uncheckedImage}
              alt="checkbox"
            />
            <span>정기적 수입이 있으나, 향후 감소 또는 불안정이 예상됨</span>
          </CheckboxWrapper>
        </QuestionBox>
        <div>
        </div>
        <QuestionBox>
          <CheckboxWrapper onClick={() => handleCheckboxChange('incomeSource', 'noIncome')}>
            <CheckboxImage
              src={answers.incomeSource === koreanValues['noIncome'] ? checkedImage : uncheckedImage}
              alt="checkbox"
            />
            <span>현재 정기적 수입이 없음</span>
          </CheckboxWrapper>
        </QuestionBox>
      </Form.Item>

      <Form.Item
        label={<span style={{ fontWeight: 'bold' }}>
          6. 파생 상품, 파생 결합 증권 및 파생 상품 펀드에 투자한 경험은 얼마나 되시나요?
        </span>}>
        <QuestionBox>
          <CheckboxWrapper onClick={() => handleCheckboxChange('derivativeExperience', 'lessThan1Year')}>
            <CheckboxImage
              src={answers.derivativeExperience === koreanValues['lessThan1Year'] ? checkedImage : uncheckedImage}
              alt="checkbox"
            />
            <span>1년 미만</span>
          </CheckboxWrapper>
        </QuestionBox>
        <div>
        </div>
        <QuestionBox>
          <CheckboxWrapper onClick={() => handleCheckboxChange('derivativeExperience', '1To3Years')}>
            <CheckboxImage
              src={answers.derivativeExperience === koreanValues['1To3Years'] ? checkedImage : uncheckedImage}
              alt="checkbox"
            />
            <span>1년 이상 ~ 3년 미만</span>
          </CheckboxWrapper>
        </QuestionBox>
        <div>
        </div>
        <QuestionBox>
          <CheckboxWrapper onClick={() => handleCheckboxChange('derivativeExperience', 'moreThan3Years')}>
            <CheckboxImage
              src={answers.derivativeExperience === koreanValues['moreThan3Years'] ? checkedImage : uncheckedImage}
              alt="checkbox"
            />
            <span>3년 이상</span>
          </CheckboxWrapper>
        </QuestionBox>
      </Form.Item>

      <StyledButton
        type="primary"
        disabled={!isButtonEnabled}
        shape="round"
        onClick={handleNext}>
        회원가입
      </StyledButton>
    </Form>
  );
};

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  cursor: pointer;
`;

const CheckboxImage = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`;

const Spacer = styled.div`
    height: 30px;
`;

const StyledButton = styled(AntButton)`
  &&& {
    width: 100%;
    height: 40px;
    background-color: #00D282;
    border-color: #00D282;
    color: white;
    border: none;

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
      background-color: #929292;
      color: white;
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
`;

const QuestionBox = styled.div`
  display: inline-block;
  height: 40px;
  background-color: #f0f0f0;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  width: auto;
`;

export default InvestmentProfileSurvey;
