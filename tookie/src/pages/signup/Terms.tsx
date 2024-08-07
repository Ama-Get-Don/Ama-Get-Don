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
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    
    const navigate = useNavigate();

    const handleAllCheckChange = () => {
        const newCheckedStatus = !isAllChecked;
        setIsAllChecked(newCheckedStatus);
        setIsTerm1Checked(newCheckedStatus);
        setIsTerm2Checked(newCheckedStatus);
        setIsTerm3Checked(newCheckedStatus);
    };
    
    const handleTermChange = (term: string) => {
        let newTerm1Checked = isTerm1Checked;
        let newTerm2Checked = isTerm2Checked;
        let newTerm3Checked = isTerm3Checked;
    
        if (term === 'term1') {
            newTerm1Checked = !isTerm1Checked;
            setIsTerm1Checked(newTerm1Checked);
        } else if (term === 'term2') {
            newTerm2Checked = !isTerm2Checked;
            setIsTerm2Checked(newTerm2Checked);
        } else if (term === 'term3') {
            newTerm3Checked = !isTerm3Checked;
            setIsTerm3Checked(newTerm3Checked);
        }
    
        const allChecked = newTerm1Checked && newTerm2Checked && newTerm3Checked;
        setIsAllChecked(allChecked);
    };
    
    useEffect(() => {
        setIsButtonEnabled(isTerm1Checked && isTerm2Checked);
    
        setIsAllChecked(isTerm1Checked && isTerm2Checked && isTerm3Checked);
    }, [isTerm1Checked, isTerm2Checked, isTerm3Checked]);
    
    const handleNext = () => {
        if (isTerm1Checked && isTerm2Checked) {
            navigate('/sign-up/info');
        }
    }

    return (
        <Container>
            <Title level={2}>이용약관</Title>
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
                    이벤트 · 혜택 정보 수신(선택) 동의를 포함합니다.
                </Paragraph>
                
                <TermItem>
                    <div 
                        onClick={() => handleTermChange('term1')} 
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    >
                        <img src={isTerm1Checked ? checkedImage : uncheckedImage} alt="checkbox" style={{ width: '20px', marginRight: '8px' }} />
                        <span>
                            <span style={{ color: '#00A868' }}>[필수]</span> 이용약관
                        </span>
                    </div>
                    <TextArea
                        value="서비스 이용약관이 들어갑니다. 내용은 추후 수정될 예정입니다."
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
                        <span>
                            <span style={{ color: '#00A868' }}>[필수]</span> 개인정보 수집 및 이용
                        </span>
                    </div>
                    <TextArea
                        value="개인정보보호법에 따라 안내 드리오니 자세히 읽은 후 동의하여 주시기 바랍니다."
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
                        <span>
                        <span style={{ color: '#929292' }}>[선택]</span> 개인정보 수집 및 이용
                        </span>
                    </div>
                    <Paragraph style={{ marginLeft: '23px', color: '#929292' }}>
                        이벤트 : 혜택 정보 수신
                    </Paragraph>
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
  height: 90vh;
  max-width: 500px;
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
      background-color: #ccc;
      color: white;
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
`;