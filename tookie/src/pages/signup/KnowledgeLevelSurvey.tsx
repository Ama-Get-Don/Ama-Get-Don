import { useState } from 'react';
import { Button, Checkbox, Form, Select } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

type FormState = {
  investmentExperience: string;
  investmentTime: string;
  investmentMethod: string;
  importantInfo: string;
  financialKnowledge: string;
  interestAreas: string[];
  additionalInfo: string[];
};

export const KnowledgeLevelSurvey = () => {
  const [form, setForm] = useState<FormState>({
    investmentExperience: '',
    investmentTime: '',
    investmentMethod: '',
    importantInfo: '',
    financialKnowledge: '',
    interestAreas: [],
    additionalInfo: [],
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

  const handleNext = () => {
    navigate('/sign-up/investment_profile_survey'); 
  };

  return (
    <Container>
      <h1>투자자님께 적합한 투자를 찾고 있어요! 아래 질문에 대답해주세요.</h1>
      <Form>
        <FormItem label="1. 주식 투자 경험이 있으신가요? 있다면 얼마나 해보셨나요?">
          <Select
            value={form.investmentExperience}
            onChange={(value) => handleChange('investmentExperience', value)}
          >
            <Option value="">선택하세요</Option>
            <Option value="less_than_1_year">없거나 1년 미만</Option>
            <Option value="1_5_years">1년 이상 ~ 5년 미만</Option>
            <Option value="more_than_5_years">5년 이상</Option>
          </Select>
        </FormItem>

        <FormItem label="2. 하루에 주식 투자 관련 정보를 수집 및 분석에 얼마나 시간을 할애하시나요?">
          <Select
            value={form.investmentTime}
            onChange={(value) => handleChange('investmentTime', value)}
          >
            <Option value="">선택하세요</Option>
            <Option value="less_than_30_minutes">30분 미만</Option>
            <Option value="30_minutes_1_hour">30분~1시간</Option>
            <Option value="more_than_1_hour">1시간 이상</Option>
          </Select>
        </FormItem>

        <FormItem label="3. 어떠한 투자전략을 사용하시나요?">
          <Select
            value={form.investmentMethod}
            onChange={(value) => handleChange('investmentMethod', value)}
          >
            <Option value="">선택하세요</Option>
            <Option value="short_term_trading">단타, 주로 차트 분석을 기반으로 주식 매매</Option>
            <Option value="long_term_investment">중장기, 종목 분석을 통해 투자</Option>
            <Option value="etf">ETF 등 인덱스 투자를 통한 분산 투자</Option>
            <Option value="no_strategy">별다른 전략은 없고 그때그때 맞는 방법으로 주식을 사고팜</Option>
          </Select>
        </FormItem>

        <FormItem label="4. 투자결정을 내릴 때 사용하는 정보는 무엇이 있나요?">
          <Select
            value={form.importantInfo}
            onChange={(value) => handleChange('importantInfo', value)}
          >
            <Option value="">선택하세요</Option>
            <Option value="news">뉴스나 소문에 따라 행동함</Option>
            <Option value="company_analysis">투자 자문사의 자료 및 기업의 재무제표에 기반한 종목 선정</Option>
            <Option value="trends">차트를 보면서 트렌드에 따라 매매</Option>
            <Option value="analyst_reports">애널리스트의 보고서와 추천 종목을 매매</Option>
          </Select>
        </FormItem>

        <FormItem label="5. 기업의 가격과 실적에 대해서 어느 정도 이해하고 있나요?">
          <Select
            value={form.financialKnowledge}
            onChange={(value) => handleChange('financialKnowledge', value)}
          >
            <Option value="">선택하세요</Option>
            <Option value="no_idea">전혀 모른다</Option>
            <Option value="basic_concept">‘밸류에이션’의 기본 개념 정도는 알고 있다</Option>
            <Option value="detailed_concept">IPO/감사보고서/IR자료/사업구조와 관련된 용어와 개념을 알고 있다</Option>
          </Select>
        </FormItem>

        <FormItem label="6. 투자경험이 있는 시장이 어디인가요? (복수선택 가능)">
          <Checkbox name="interestAreas" value="domestic" onChange={handleCheckboxChange}>국내시장</Checkbox>
          <Checkbox name="interestAreas" value="overseas" onChange={handleCheckboxChange}>해외시장</Checkbox>
        </FormItem>

        <FormItem label="7. 알고 있는 주식 용어들을 골라주세요">
          <Checkbox name="additionalInfo" value="basic" onChange={handleCheckboxChange}>기본</Checkbox>
          <Checkbox name="additionalInfo" value="valuation" onChange={handleCheckboxChange}>PER/PBR</Checkbox>
          <Checkbox name="additionalInfo" value="etf" onChange={handleCheckboxChange}>ETF</Checkbox>
          <Checkbox name="additionalInfo" value="derivatives" onChange={handleCheckboxChange}>주식/금리 파생상품</Checkbox>
          <Checkbox name="additionalInfo" value="roe_roa" onChange={handleCheckboxChange}>ROE/ROA</Checkbox>
          <Checkbox name="additionalInfo" value="financial_statements" onChange={handleCheckboxChange}>재무/기본분석</Checkbox>
          <Checkbox name="additionalInfo" value="esg" onChange={handleCheckboxChange}>ESG</Checkbox>
          <Checkbox name="additionalInfo" value="ratios" onChange={handleCheckboxChange}>P/E & P/B 비율</Checkbox>
          <Checkbox name="additionalInfo" value="technical_analysis" onChange={handleCheckboxChange}>주가/차트</Checkbox>
          <Checkbox name="additionalInfo" value="other" onChange={handleCheckboxChange}>기타/기록할 분석</Checkbox>
          <Checkbox name="additionalInfo" value="cash_flow" onChange={handleCheckboxChange}>손익계산서</Checkbox>
        </FormItem>

        <ButtonContainer>
          <Button type="primary" htmlType="submit" onClick={handleNext}>
            다음
          </Button>
        </ButtonContainer>
      </Form>
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

const FormItem = styled(Form.Item)`
  width: 100%;
  max-width: 600px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export default KnowledgeLevelSurvey;
