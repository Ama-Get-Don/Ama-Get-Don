import { styled } from "styled-components";
import { Button as AntButton, Typography, Space, Input } from 'antd';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import checkedImage from '../../assets/after_check.png';
import uncheckedImage from '../../assets/before_check.png';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

export const Terms = () => {
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [isTerm1Checked, setIsTerm1Checked] = useState(false);
    const [isTerm2Checked, setIsTerm2Checked] = useState(false);
    const [isTerm3Checked, setIsTerm3Checked] = useState(false);
    const [isTerm4Checked, setIsTerm4Checked] = useState(false);
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    
    const navigate = useNavigate();

    const handleAllCheckChange = () => {
        const newCheckedStatus = !isAllChecked;
        setIsAllChecked(newCheckedStatus);
        setIsTerm1Checked(newCheckedStatus);
        setIsTerm2Checked(newCheckedStatus);
        setIsTerm3Checked(newCheckedStatus);
        setIsTerm4Checked(newCheckedStatus);
    };
    
    const handleTermChange = (term: string) => {
        let newTerm1Checked = isTerm1Checked;
        let newTerm2Checked = isTerm2Checked;
        let newTerm3Checked = isTerm3Checked;
        let newTerm4Checked = isTerm4Checked;
    
        if (term === 'term1') {
            newTerm1Checked = !isTerm1Checked;
            setIsTerm1Checked(newTerm1Checked);
        } else if (term === 'term2') {
            newTerm2Checked = !isTerm2Checked;
            setIsTerm2Checked(newTerm2Checked);
        } else if (term === 'term3') {
            newTerm3Checked = !isTerm3Checked;
            setIsTerm3Checked(newTerm3Checked);
        } else if (term === 'term4') {
            newTerm4Checked = !isTerm4Checked;
            setIsTerm4Checked(newTerm4Checked);
        }
    
        const allChecked = newTerm1Checked && newTerm2Checked && newTerm3Checked && newTerm4Checked;
        setIsAllChecked(allChecked);
    };
    
    useEffect(() => {
        setIsButtonEnabled(isTerm1Checked && isTerm2Checked && isTerm3Checked);
    
        setIsAllChecked(isTerm1Checked && isTerm2Checked && isTerm3Checked && isTerm4Checked);
    }, [isTerm1Checked, isTerm2Checked, isTerm3Checked, isTerm4Checked]);
    
    const handleNext = () => {
        if (isTerm1Checked && isTerm2Checked && isTerm3Checked) {
            navigate('/sign-up/info');
        }
    }

    return (
        <Container>
            <Title level={3}>이용 약관</Title>
            <Space direction="vertical" size="large">
                <div
                    onClick={handleAllCheckChange} 
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                    <img 
                        src={isAllChecked ? checkedImage : uncheckedImage} 
                        alt="checkbox" 
                        style={{ width: '20px', marginRight: '8px' }} 
                    />
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem'}}>전체 동의하기</span>
                </div>
                <Paragraph style={{ marginLeft: '23px', marginTop: '-15px', color: '#929292' }}>
                    이용약관, 개인정보 수집 및 이용, 투자 성향 정보 제공 여부를 포함합니다
                </Paragraph>
                
                <TermItem>
                    <div 
                        onClick={() => handleTermChange('term1')} 
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    >
                        <img src={isTerm1Checked ? checkedImage : uncheckedImage} alt="checkbox" style={{ width: '20px', marginRight: '8px' }} />
                        <strong>
                        <span>
                            <span style={{ color: '#00A868' }}>[필수]</span> 이용약관
                        </span>
                        </strong>
                    </div>
                    <TextArea
                        value="서비스 제공 목적:
본 서비스는 사용자의 주식 관련 지식 수준과 투자 성향을 고려하여 맞춤형 투자 조언을 제공하는 AI 챗봇 서비스입니다.

이용자 의무:
타인의 개인정보를 도용하거나 허위 정보를 제공해서는 안 됩니다.
본 서비스를 악의적으로 이용하거나 서비스 운영을 방해하는 행위를 금지합니다.

책임 제한:
본 서비스에서 제공되는 모든 투자 조언은 참고용이며, 최종 투자 결정은 사용자 본인의 책임입니다.
본 서비스는 투자 손실에 대한 어떠한 책임도 지지 않습니다. 다만, 법적 규제에 따라 적절한 주의와 관리를 위해 노력합니다.

전문성 보장:
본 서비스는 최신 금융 데이터를 기반으로 투자 조언을 제공하며, 정기적으로 모델을 업데이트합니다.
제공되는 정보는 일반적인 금융 상황에 기반한 것이며, 개별적인 재무 상황을 고려한 개인 맞춤형 조언이 아님을 유의해야 합니다."
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        readOnly
                    />
                </TermItem>

                <TermItem>
                    <div 
                        onClick={() => handleTermChange('term2')} 
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    >
                        <img src={isTerm2Checked ? checkedImage : uncheckedImage} alt="checkbox" style={{ width: '20px', marginRight: '8px' }} />
                        <strong>
                        <span>
                            <span style={{ color: '#00A868' }}>[필수]</span> 개인정보 수집 및 이용
                        </span>
                        </strong>
                    </div>
                    <TextArea
                        value="개인정보보호법에 따라 회원가입 신청하시는 분께 수집하는 개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유 및 이용기간, 개인정보 제공 및 공유에 관한 사항을 안내 드리오니 자세히 읽은 후 동의하여 주시기 바랍니다.

수집하는 개인정보 항목:
사용자 계정 정보: 아이디, 비밀번호, 이메일 주소, 이름, 생년월일 8자리, 휴대전화번호, 성별
지식 수준 및 투자 성향 관련 정보: 사용자 제공 투자 경험, 투자 목표, 리스크 수용도 등
서비스 이용 기록: 접속 로그, 이용 시간, 이용 기록

개인정보의 수집 및 이용 목적:
맞춤형 투자 조언 제공
서비스 운영 및 품질 향상을 위한 통계 분석
이용자의 서비스 문의 및 지원 제공

개인정보 보유 및 이용 기간:
사용자의 개인정보는 서비스 이용 기간 동안 보유하며, 이용 종료 시 즉시 파기합니다.
법령에 따라 일정 기간 보관해야 하는 정보는 해당 기간 동안 보관합니다.

개인정보 제공 및 공유:
사용자의 개인정보는 원칙적으로 제3자에게 제공하지 않습니다.
법령에 따라 필요한 경우, 사용자의 동의를 받은 경우에 한해 제공할 수 있습니다."
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        readOnly
                    />
                </TermItem>

                <TermItem>
                    <div
                        onClick={() => handleTermChange('term3')} 
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    >
                        <img src={isTerm3Checked ? checkedImage : uncheckedImage} alt="checkbox" style={{ width: '20px', marginRight: '8px' }} />
                        <strong>
                        <span>
                            <span style={{ color: '#00A868' }}>[필수]</span> 투자 성향 정보 제공 여부
                        </span>
                        </strong>
                    </div>
                    <TextArea
                        value="투자 성향 정보의 제공:
본 서비스는 사용자가 제공한 투자 성향 정보를 바탕으로 맞춤형 답변을 제공합니다.
사용자는 투자 성향 정보 제공에 동의하는 경우, 본 서비스가 해당 정보를 수집 및 분석하여 맞춤형 조언을 제공하는 것에 동의하게 됩니다.
사용자는 투자 성향 정보를 제공하지 않을 권리가 있으며, 이 경우 서비스 사용이 제한될 수 있습니다."
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        readOnly
                    />
                </TermItem>

                <TermItem>
                    <div
                        onClick={() => handleTermChange('term4')} 
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    >
                        <img src={isTerm4Checked ? checkedImage : uncheckedImage} alt="checkbox" style={{ width: '20px', marginRight: '8px' }} />
                        <strong>
                        <span>
                        <span style={{ color: '#929292' }}>[선택]</span> 이벤트 · 혜택 정보 수신
                        </span>
                        </strong>
                    </div>
                </TermItem>
                <StyledButton type="primary" shape="round" disabled={!isButtonEnabled} onClick={handleNext}>
                    다음
                </StyledButton>
            </Space>
        </Container>
    );
}

export default Terms;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 110vh;
  margin: 0 auto;
  background-color: white;
`;

const TermItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 800px;
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