import { useState, useEffect, useCallback } from 'react';
import { Button as AntButton, Typography, Form } from 'antd';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import checkedImage from '../../assets/after_check.png';
import uncheckedImage from '../../assets/before_check.png';
import { useGlobalState } from '../../GlobalState'; // GlobalState import 추가

const { Title } = Typography;

type Answers = {
  experience: string;
  dailyTime: string;
  strategy: string;
  investmentInfo: string;
  decisionUnderstanding: string;
  marketExperience: string[];
  stockTerms: string[];
};

const weights = {
  "1": 0.1428571429,
  "2": 0.2857142857,
  "3": 0.4285714286
};

export const KnowledgeLevelSurvey: React.FC = () => {
  const [answers, setAnswers] = useState<Answers>({
    experience: '',
    dailyTime: '',
    strategy: '',
    investmentInfo: '',
    decisionUnderstanding: '',
    marketExperience: [],
    stockTerms: [],
  });
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const { setGlobalState } = useGlobalState(); // GlobalState 사용

  const navigate = useNavigate();

  const handleCheckboxChange = (key: keyof Answers, value: string) => {
    setAnswers(prev => {
      if (key === 'stockTerms' || key === 'marketExperience') {
        const currentValues = prev[key];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value];
        
        return {
          ...prev,
          [key]: newValues
        };
      } else {
        return {
          ...prev,
          [key]: value === prev[key] ? '' : value,
        };
      }
    });
  };

  const calculateTotalScore = () => {
    let totalScore = 0;

    // experience
    if (answers.experience === 'lessThan1Year') totalScore += weights["1"];
    else if (answers.experience === '1To5Years') totalScore += weights["2"];
    else if (answers.experience === 'moreThan5Years') totalScore += weights["3"];

    // dailyTime
    if (answers.dailyTime === 'lessThan30Minutes') totalScore += weights["1"];
    else if (answers.dailyTime === '30MinutesTo1Hour') totalScore += weights["2"];
    else if (answers.dailyTime === 'moreThan1Hour') totalScore += weights["3"];

    // strategy
    if (answers.strategy === 'familyAndFriends') totalScore += weights["1"];
    else if (answers.strategy === 'marketForecasting') totalScore += weights["2"];
    else if (answers.strategy === 'personalPortfolio') totalScore += weights["3"];

    // investmentInfo
    if (answers.investmentInfo === 'news') totalScore += weights["1"];
    else if (answers.investmentInfo === 'reportsAndStatements') totalScore += weights["2"];
    else if (answers.investmentInfo === 'inDepthAnalysis') totalScore += weights["3"];

    // decisionUnderstanding
    if (answers.decisionUnderstanding === 'noUnderstanding') totalScore += weights["1"];
    else if (answers.decisionUnderstanding === 'dividendUnderstanding') totalScore += weights["2"];
    else if (answers.decisionUnderstanding === 'ipoUnderstanding') totalScore += weights["3"];

    // marketExperience
    const marketExperienceWeight = answers.marketExperience.length * weights["1"];
    totalScore += marketExperienceWeight;

    // stockTerms
    const stockTermsCount = answers.stockTerms.length;
    if (stockTermsCount >= 1 && stockTermsCount <= 5) totalScore += weights["1"];
    else if (stockTermsCount >= 6 && stockTermsCount <= 10) totalScore += weights["2"];
    else if (stockTermsCount >= 11) totalScore += weights["3"];

    return totalScore;
  };

  const determineLevel = (): number => {
    const totalScore = calculateTotalScore();
    if (totalScore <= 2.0) return 1; // 씨앗
    if (totalScore <= 3.0) return 2; // 새순
    return 3; // 투키
  };

  const handleNext = () => {
    if (isAnswersValid()) {
      const level = determineLevel();
      console.log("Calculated Investment Level: ", level);
      
      // GlobalState 업데이트
      setGlobalState(prev => ({
        ...prev,
        user_create: {
          ...prev.user_create,
          investment_level: level
        }
      }));

      navigate('/sign-up/investment_profile_survey');
    } else {
      console.error('Invalid answers');
    }
  };

  const isAnswersValid = useCallback(() => {
    return (
      answers.experience !== '' &&
      answers.dailyTime !== '' &&
      answers.strategy !== '' &&
      answers.investmentInfo !== '' &&
      answers.decisionUnderstanding !== '' &&
      answers.marketExperience.length > 0 &&
      answers.stockTerms.length > 0
    );
  }, [answers]);
  
  useEffect(() => {
    setIsButtonEnabled(isAnswersValid());
  }, [answers, isAnswersValid]);

  const getTermLabel = (term: string): string => {
    const labels: { [key: string]: string } = {
      commonStock: '보통주',
      eps: 'EPS',
      perPbr: 'PER/PBR',
      etf: 'ETF',
      leverage: '재무/영업 레버리지',
      roeRoa: 'ROE/ROA',
      ratio: '자본/자산 회전율',
      esg: 'ESG',
      pepb: 'P/E & P/B 비율',
      el: '주가 지수',
      fundamentalTechnical: '기본적/기술적 분석',
      incomeStatement: '손익계산서',
      balanceSheet: '재무상태표',
      cashFlow: '현금흐름표'
    };
    return labels[term] || term;
  };

  const getMarketLabel = (term: string): string => {
    const labels: { [key: string]: string } = {
      noExperience: '투자 경험이 없다',
      domesticMarket: '국내 시장(코스피, 코스닥)',
      internationalMarket: '해외 시장',
      derivativesMarket: '선물/옵션 시장'
    };
    return labels[term] || term;
  };

  return (
    <Form
      layout="vertical"
      style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}
      onFinish={handleNext}
    >
      <Title level={4} style={{ fontWeight: 'bold', color: '#00D282' }}>
        투자자님에게 적합한 투키를 찾고 있어요! 아래 질문에 대답해 주세요.
      </Title>

      <Spacer/>

      <Form.Item
        label={<span style={{ fontWeight: 'bold' }}>
          1. 주식 투자 경험이 있으신가요? 있다면 얼마나 해보셨나요?
        </span>}>
        <QuestionBox>
          <CheckboxWrapper onClick={() => handleCheckboxChange('experience', 'lessThan1Year')}>
            <CheckboxImage src={answers.experience === 'lessThan1Year' ? checkedImage : uncheckedImage} alt="checkbox" />
            <span>없거나 1년 미만</span>
          </CheckboxWrapper>
        </QuestionBox>
        <QuestionBox>
          <CheckboxWrapper onClick={() => handleCheckboxChange('experience', '1To5Years')}>
            <CheckboxImage src={answers.experience === '1To5Years' ? checkedImage : uncheckedImage} alt="checkbox" />
            <span>1년 이상 ~ 5년 미만</span>
          </CheckboxWrapper>
        </QuestionBox>
        <QuestionBox>
          <CheckboxWrapper onClick={() => handleCheckboxChange('experience', 'moreThan5Years')}>
            <CheckboxImage src={answers.experience === 'moreThan5Years' ? checkedImage : uncheckedImage} alt="checkbox" />
            <span>5년 이상</span>
          </CheckboxWrapper>
        </QuestionBox>
      </Form.Item>

      <Form.Item
      label={<span style={{ fontWeight: 'bold' }}>
        2. 하루에 주식 투자 관련 정보 수집 및 분석에 얼마나 시간을 할애하시나요?
      </span>}>
      <QuestionBox>
        <CheckboxWrapper onClick={() => handleCheckboxChange('dailyTime', 'lessThan30Minutes')}>
          <CheckboxImage src={answers.dailyTime === 'lessThan30Minutes' ? checkedImage : uncheckedImage} alt="checkbox" />
          <span>30분 미만</span>
        </CheckboxWrapper>
      </QuestionBox>
      <div>
      </div>
      <QuestionBox>
        <CheckboxWrapper onClick={() => handleCheckboxChange('dailyTime', '30MinutesTo1Hour')}>
          <CheckboxImage src={answers.dailyTime === '30MinutesTo1Hour' ? checkedImage : uncheckedImage} alt="checkbox" />
          <span>30분 이상 ~ 1시간 미만</span>
        </CheckboxWrapper>
      </QuestionBox>
      <div>
      </div>
      <QuestionBox>
        <CheckboxWrapper onClick={() => handleCheckboxChange('dailyTime', 'moreThan1Hour')}>
          <CheckboxImage src={answers.dailyTime === 'moreThan1Hour' ? checkedImage : uncheckedImage} alt="checkbox" />
          <span>1시간 이상</span>
        </CheckboxWrapper>
      </QuestionBox>
      </Form.Item>

      <Form.Item
      label={<span style={{ fontWeight: 'bold' }}>
        3. 어떠한 투자 전략을 사용하시나요?
      </span>}>
      <QuestionBox>
        <CheckboxWrapper onClick={() => handleCheckboxChange('strategy', 'familyAndFriends')}>
          <CheckboxImage src={answers.strategy === 'familyAndFriends' ? checkedImage : uncheckedImage} alt="checkbox" />
          <span>친구, 가족의 조언에 따라 투자, 간단한 투자 전략(ex. ETF, 장기 투자)</span>
        </CheckboxWrapper>
      </QuestionBox>
      <QuestionBox>
        <CheckboxWrapper onClick={() => handleCheckboxChange('strategy', 'marketForecasting')}>
          <CheckboxImage src={answers.strategy === 'marketForecasting' ? checkedImage : uncheckedImage} alt="checkbox" />
          <span>시장 상황에 따라 상승 및 하락 주세 예측, 본인만의 포트폴리오 보유</span>
        </CheckboxWrapper>
      </QuestionBox>
      <QuestionBox>
        <CheckboxWrapper onClick={() => handleCheckboxChange('strategy', 'personalPortfolio')}>
          <CheckboxImage src={answers.strategy === 'personalPortfolio' ? checkedImage : uncheckedImage} alt="checkbox" />
          <span>본인의 포트폴리오를 보유하여 하락장에서도 손해를 감소시킬 수 있음, 환율 및 세금 고려</span>
      </CheckboxWrapper>
      </QuestionBox>
      </Form.Item>

      <Form.Item
      label={<span style={{ fontWeight: 'bold' }}>
        4. 투자 결정을 내릴 때 주로 사용하는 정보는 무엇이 있나요?
      </span>}>
      <QuestionBox>
        <CheckboxWrapper onClick={() => handleCheckboxChange('investmentInfo', 'news')}>
          <CheckboxImage src={answers.investmentInfo === 'news' ? checkedImage : uncheckedImage} alt="checkbox" />
          <span>뉴스나 소문에 따라 투자 결정</span>
        </CheckboxWrapper>
      </QuestionBox>
      <div>
      </div>
      <QuestionBox>
        <CheckboxWrapper onClick={() => handleCheckboxChange('investmentInfo', 'reportsAndStatements')}>
          <CheckboxImage src={answers.investmentInfo === 'reportsAndStatements' ? checkedImage : uncheckedImage} alt="checkbox" />
          <span>투자 리포트, 기업의 재무제표를 간단히 분석</span>
        </CheckboxWrapper>
      </QuestionBox>
      <QuestionBox>
        <CheckboxWrapper onClick={() => handleCheckboxChange('investmentInfo', 'inDepthAnalysis')}>
          <CheckboxImage src={answers.investmentInfo === 'inDepthAnalysis' ? checkedImage : uncheckedImage} alt="checkbox" />
          <span>재무제표 분석과 더불어 심도 있는 분석(기본적/기술적 분석)</span>
        </CheckboxWrapper>
      </QuestionBox>
      </Form.Item>

      <Form.Item
      label={<span style={{ fontWeight: 'bold' }}>
        5. 기업의 주식 관련 의사 결정에 대하여 어느 정도 이해하고 있나요?
      </span>}>
      <QuestionBox> 
        <CheckboxWrapper onClick={() => handleCheckboxChange('decisionUnderstanding', 'noUnderstanding')}>
          <CheckboxImage src={answers.decisionUnderstanding === 'noUnderstanding' ? checkedImage : uncheckedImage} alt="checkbox" />
          <span>전혀 모른다</span>
        </CheckboxWrapper>  
      </QuestionBox>
      <div>
      </div>
      <QuestionBox>
        <CheckboxWrapper onClick={() => handleCheckboxChange('decisionUnderstanding', 'dividendUnderstanding')}>
          <CheckboxImage src={answers.decisionUnderstanding === 'dividendUnderstanding' ? checkedImage : uncheckedImage} alt="checkbox" />
          <span>'배당 결정' 정도만 이해하고 있다</span>
        </CheckboxWrapper>
      </QuestionBox>
      <QuestionBox>
        <CheckboxWrapper onClick={() => handleCheckboxChange('decisionUnderstanding', 'ipoUnderstanding')}>
          <CheckboxImage src={answers.decisionUnderstanding === 'ipoUnderstanding' ? checkedImage : uncheckedImage} alt="checkbox" />
          <span>IPO, 상장, 증자, 주식 분할, 자사주 매입 등이 무엇인지 이해하고 있다</span>
      </CheckboxWrapper>
      </QuestionBox>
      </Form.Item>

      <Form.Item
        label={<span style={{ fontWeight: 'bold' }}>
          6. 투자경험이 있는 시장이 어디인가요? (복수 선택 가능)
        </span>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', width: '35%' }}>
          {['noExperience', 'domesticMarket', 'internationalMarket', 'derivativesMarket'].map((market) => (
            <QuestionBox key={market}>
              <CheckboxWrapper onClick={() => handleCheckboxChange('marketExperience', market)}>
                <CheckboxImage 
                  src={answers.marketExperience.includes(market) ? checkedImage : uncheckedImage} 
                  alt="checkbox" 
                />
                <span>{getMarketLabel(market)}</span>
              </CheckboxWrapper>
            </QuestionBox>
          ))}
        </div>
      </Form.Item>

      <Form.Item
        label={<span style={{ fontWeight: 'bold' }}>7. 알고 있는 주식 용어를 모두 선택해 주세요!</span>}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
          {['commonStock', 'eps', 'perPbr', 'etf', 'leverage', 'roeRoa', 'ratio', 'esg', 'pepb', 'el', 'fundamentalTechnical', 'incomeStatement', 'balanceSheet', 'cashFlow'].map((term) => (
            <WordButton
              key={term}
              type={answers.stockTerms.includes(term) ? 'primary' : 'default'}
              onClick={() => handleCheckboxChange('stockTerms', term)}
              style={{ minWidth: '130px'}}
              block
            >
              {getTermLabel(term)}
            </WordButton>
          ))}
        </div>
      </Form.Item>

      <Form.Item>
        <StyledButton
        type="primary"
        shape="round"
        htmlType="submit"
        disabled={!isButtonEnabled}
        >
          다음
        </StyledButton>
      </Form.Item>
    </Form>
  );
};

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  color: #929292;
`;

const CheckboxImage = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`;

const Spacer = styled.div`
    height: 30px;
    color: #929292;
`;

const WordButton = styled(AntButton)`
  width: 100%;
  height: 40px;
  background-color: ${(props) => (props.type === 'primary' ? '#00B870' : '#f0f0f0')};
  color: ${(props) => (props.type === 'primary' ? 'white' : '#8c8c8c')};
  border: none;
  box-shadow: none;

  &:hover, &:focus {
    background-color: ${(props) => (props.type === 'primary' ? '#009A5E' : '#e0e0e0')};
    color: ${(props) => (props.type === 'primary' ? 'white' : '#595959')};
  }

  &:active {
    background-color: #009A5E;
    border-color: #009A5E;
    color: white;
  }
`;

const StyledButton = styled(AntButton)`
  &&& {
    width: 105%;
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

export default KnowledgeLevelSurvey;