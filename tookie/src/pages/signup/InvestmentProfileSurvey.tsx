import { useState } from 'react';
import { Button, Checkbox, Form, Radio } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

type FormState = {
  investmentGoal: string;
  lossTolerance: string;
  riskPercentage: string;
  investmentPeriod: string;
  profitExpectation: string;
  investmentKnowledge: string;
  financialExperience: string[];
};

export const InvestmentProfileSurvey = () => {
  const [form, setForm] = useState<FormState>({
    investmentGoal: '',
    lossTolerance: '',
    riskPercentage: '',
    investmentPeriod: '',
    profitExpectation: '',
    investmentKnowledge: '',
    financialExperience: [],
  });

  const navigate = useNavigate();

  const handleChange = (name: keyof FormState, value: string) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    const { name, checked, value } = e.target;
    const fieldName = name as keyof FormState;
    setForm(prevForm => ({
      ...prevForm,
      [fieldName]: checked
        ? [...(prevForm[fieldName] as string[]), value]
        : (prevForm[fieldName] as string[]).filter(item => item !== value),
    }));
  };

  const handleNext = async () => {
    const payload = {
      investmentPreference_create: {
        user_id: 0,  
        investment_goal: form.investmentGoal,
        risk_tolerance: form.lossTolerance,
        investment_ratio: form.riskPercentage,
        investment_period: form.investmentPeriod,
        income_status: form.profitExpectation,
        derivatives_experience: form.investmentKnowledge,
      }
    };
  
    try {
      const response = await fetch('/api/saveInvestmentProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        console.log('Data saved successfully');
        navigate('/sign-up/complete');
      } else {
        console.error('Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <Container>
      <h1>사용자님의 투자 성향을 알아보기 위한 질문입니다! 아래 질문에 대답해주세요.</h1>
      <StyledForm>
        <FormItem label="1. 주식 투자의 목표는 무엇인가요?">
          <Radio.Group
            value={form.investmentGoal}
            onChange={(e) => handleChange('investmentGoal', e.target.value)}
          >
            <StyledRadio value="stable">원금 보존과 함께 연 1-2%의 수익률을 얻기 위함</StyledRadio>
            <StyledRadio value="moderate">연간 수익률 3-5%를 기대하며 원금의 큰 손실은 피하고 싶음</StyledRadio>
            <StyledRadio value="aggressive">원금 손실을 감수하고 높은 수익률을 기대함</StyledRadio>
          </Radio.Group>
        </FormItem>

        <FormItem label="2. 주식에서 일일 손실을 감수할 수 있는 정도는 어느 정도인가요?">
          <Radio.Group
            value={form.lossTolerance}
            onChange={(e) => handleChange('lossTolerance', e.target.value)}
          >
            <StyledRadio value="low">주식에 큰 관심은 없으며 손실을 피하고 싶음</StyledRadio>
            <StyledRadio value="medium">약간의 손실은 감수할 수 있음</StyledRadio>
            <StyledRadio value="high">손실을 감수하고 큰 수익을 기대함</StyledRadio>
          </Radio.Group>
        </FormItem>

        <FormItem label="3. 주식에서 수익을 내야 하는 자금의 전체 중 손실 가능한 정도의 비율은 차지하나요?">
          <Radio.Group
            value={form.riskPercentage}
            onChange={(e) => handleChange('riskPercentage', e.target.value)}
          >
            <StyledRadio value="10%">10% 이하</StyledRadio>
            <StyledRadio value="30%">10% 이상 - 30% 미만</StyledRadio>
            <StyledRadio value="over_30%">30% 이상</StyledRadio>
          </Radio.Group>
        </FormItem>

        <FormItem label="4. 어느 정도의 기간 동안 자금을 투자할 계획인가요?">
          <Radio.Group
            value={form.investmentPeriod}
            onChange={(e) => handleChange('investmentPeriod', e.target.value)}
          >
            <StyledRadio value="1_year">1년 미만</StyledRadio>
            <StyledRadio value="1_5_years">1년 이상 ~ 5년 미만</StyledRadio>
            <StyledRadio value="over_5_years">5년 이상</StyledRadio>
          </Radio.Group>
        </FormItem>

        <FormItem label="5. 사용자님의 수익률을 가장 잘 나타내는 것은 어느 것인가요?">
          <Radio.Group
            value={form.profitExpectation}
            onChange={(e) => handleChange('profitExpectation', e.target.value)}
          >
            <StyledRadio value="low">정기적 수입이 있으며, 주식의 손실을 투자 자금에서 충당할 수 있음</StyledRadio>
            <StyledRadio value="medium">정기적 수입이 있으나, 주식의 어느 정도 손실은 감수할 수 있음</StyledRadio>
            <StyledRadio value="high">정기적 수입이 없으며, 주식의 손실은 자금의 큰 부분에 영향을 미침</StyledRadio>
          </Radio.Group>
        </FormItem>

        <FormItem label="6. 채권, 부동산, 펀드 경험 중 긴 여정 상품 편드에 투자한 경험은 얼마나 되시나요?">
          <Radio.Group
            value={form.investmentKnowledge}
            onChange={(e) => handleChange('investmentKnowledge', e.target.value)}
          >
            <StyledRadio value="1_year">1년 미만</StyledRadio>
            <StyledRadio value="1_5_years">1년 이상 ~ 5년 미만</StyledRadio>
            <StyledRadio value="over_5_years">5년 이상</StyledRadio>
          </Radio.Group>
        </FormItem>

        <FormItem label={
          <>
            7. 고령투자자, 주부, 은퇴자 등 금융 투자 상품에 대한 이해가 부족하거나 투자 경험이 없는 투자자의 경우 <br />
            「금융소비자 보호모범규준」에 따른 금융 취약 계층으로 금융 소비자의 불이익 사항을 다른 정보보다 <br />
            우선하여 설명 받으실 수 있습니다. 해당 항목에 체크하여 주시기 바랍니다. <br />
            단, 금융 취약자에 대한 정보 제공을 거부하는 경우 「금융소비자 보호모범규준」상 강화된 적합성 원칙 및 <br />
            설명 의무의 적용이 배제됩니다.
          </>
        }>
          <CheckboxGroup>
            <Checkbox name="financialExperience" value="financial_advisor" onChange={handleCheckboxChange}>금융 투자 상품에 대한 이해가 부족하거나 투자 경험이 없음</Checkbox>
            <Checkbox name="financialExperience" value="none" onChange={handleCheckboxChange}>해당 사항 없음</Checkbox>
          </CheckboxGroup>
        </FormItem>

        <ButtonContainer>
          <Button type="primary" htmlType="submit" onClick={handleNext}>
            다음
          </Button>
        </ButtonContainer>
      </StyledForm>
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

const StyledForm = styled(Form)`
  width: 100%;
  max-width: 800px; /* Increase the width */
`;

const FormItem = styled(Form.Item)`
  width: 100%;
  white-space: pre-wrap; /* This will make long text wrap and prevent overflow */
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const StyledRadio = styled(Radio)`
  display: block;
  background: #f5f5f5;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #d9d9d9;
  width: 100%;
  &:hover {
    border-color: #40a9ff;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export default InvestmentProfileSurvey;
