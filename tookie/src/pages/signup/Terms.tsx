import { styled } from "styled-components";
import { Checkbox, Button, Typography, Space } from 'antd';
import { useState } from "react";
import { CheckboxChangeEvent } from "antd/es/checkbox";

const { Title, Paragraph } = Typography;

export const Terms = () => {
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [isTerm1Checked, setIsTerm1Checked] = useState(false);
    const [isTerm2Checked, setIsTerm2Checked] = useState(false);
    const [isTerm3Checked, setIsTerm3Checked] = useState(false);

    const handleAllCheckChange = (e: CheckboxChangeEvent) => {
        const checked = e.target.checked;
        setIsAllChecked(checked);
        setIsTerm1Checked(checked);
        setIsTerm2Checked(checked);
        setIsTerm3Checked(checked);
    };

    const handleTermChange = () => {
        setIsAllChecked(isTerm1Checked && isTerm2Checked);
    };

    return (
        <Container>
            <Title level={2}>이용약관</Title>
            <Paragraph>
                이용약관에 대한 내용을 아래에서 확인하고 동의해주세요.
            </Paragraph>
            <Space direction="vertical" size="large">
                <Checkbox
                    checked={isAllChecked}
                    onChange={handleAllCheckChange}
                >
                    전체 동의하기
                </Checkbox>
                <Checkbox
                    checked={isTerm1Checked}
                    onChange={(e) => {
                        setIsTerm1Checked(e.target.checked);
                        handleTermChange();
                    }}
                >
                    [필수] 이용약관

                </Checkbox>

                <Checkbox
                    checked={isTerm2Checked}
                    onChange={(e) => {
                        setIsTerm2Checked(e.target.checked);
                        handleTermChange();
                    }}
                >
                    [필수] 개인정보 수집 및 이용
                </Checkbox>
                <Checkbox
                    checked={isTerm3Checked}
                    onChange={(e: CheckboxChangeEvent) => {
                        setIsTerm3Checked(e.target.checked);
                        handleTermChange();
                    }}
                >
                    [선택 약관]
                </Checkbox>
                <Button type="primary" disabled={!isAllChecked}>
                    동의하고 다음으로
                </Button>
            </Space>
        </Container>
    )
}

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #ffffff;
`;