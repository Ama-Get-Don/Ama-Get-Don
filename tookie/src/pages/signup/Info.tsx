import { Form, Input, DatePicker, Button as AntButton } from "antd";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState } from "react";



interface FormValues {
    username: string;
    password: string;
    email: string;
    name: string;
    birthdate: moment.Moment; 
    phone: string;
    gender: 'male' | 'female';
}



export const Info: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);


    const handleFinish = (values: FormValues) => {
        console.log('Form Values: ', values);
        navigate('/sign-up/knowledge_level_survey');
    };

    const handleGenderSelect = (gender: 'male' | 'female') => {
        setSelectedGender(gender);
        form.setFieldsValue({ gender });

        setIsButtonEnabled(true);
    };

    return (
        <Container>
            <FormWrapper>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                >
                    <StyledFormItem
                        name="username"
                        rules={[{ required: true, message: '아이디를 입력해주세요' }]}
                    >
                        <Input placeholder="아이디" />
                    </StyledFormItem>
                    <StyledFormItem
                        name="password"
                        rules={[{ required: true, message: '비밀번호를 입력해주세요' }]}
                    >
                        <Input.Password placeholder="비밀번호" />
                    </StyledFormItem>
                    <StyledFormItem
                        name="email"
                        rules={[{ required: true, message: '이메일 주소를 입력해주세요', type: 'email' }]}
                    >
                        <Input placeholder="이메일 주소" />
                    </StyledFormItem>
                    <Spacer />
                    <StyledFormItem
                        name="name"
                        rules={[{ required: true, message: '이름을 입력해주세요' }]}
                    >
                        <Input placeholder="이름" />
                    </StyledFormItem>
                    <StyledFormItem
                        name="birthdate"
                        rules={[{ required: true, message: '생년월일을 입력해주세요' }]}
                    >
                        <DatePicker style={{ width: '100%' }} placeholder="생년월일" />
                    </StyledFormItem>
                    <StyledFormItem
                        name="phone"
                        rules={[{ required: true, message: '휴대전화 번호를 입력해주세요' }]}
                    >
                        <Input placeholder="휴대전화 번호" />
                    </StyledFormItem>
                    <Form.Item
                        name="gender"
                        rules={[{ required: true, message: '성별을 선택해주세요' }]}
                    >
                            <GenderButton
                                onClick={() => handleGenderSelect('male')}
                                $isSelected={selectedGender === 'male'}
                                type="default"
                                style={{ marginRight: '10px', height: '35px', width: '70px' }}
                            >
                                남성
                            </GenderButton>
                            <GenderButton
                                onClick={() => handleGenderSelect('female')}
                                $isSelected={selectedGender === 'female'}
                                type="default"
                                style={{ marginRight: '10px', height: '35px', width: '70px' }}
                            >
                                여성
                            </GenderButton>
                    </Form.Item>        
                    <Spacer />
                    <Form.Item>
                        <ButtonContainer>
                            <SubmitButton
                            type="primary"
                            shape="round"
                            disabled={!isButtonEnabled}
                            htmlType="submit"
                            >
                                다음
                            </SubmitButton>
                        </ButtonContainer>
                    </Form.Item>
                </Form>
            </FormWrapper>
        </Container>
    );
};

export default Info;


const Container = styled.div`
    display: flex;
    justify-content: center;
    min-height: 100vh;
    padding: 100px;
`;

const Spacer = styled.div`
    height: 30px; // 원하는 공간 크기
`;

const FormWrapper = styled.div`
    width: 100%;
    max-width: 400px;
`;

const StyledFormItem = styled(Form.Item)`
    margin-bottom: 5px;{
    }

    .ant-input, .ant-input-password, .ant-picker, .ant-select-selector{
        height: 45px !important;
    }

    .ant-select-selector {
        align-items: center;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`;

const SubmitButton = styled(AntButton)`
    &&& {
    width: 150%;
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

    &&:disabled {
        background-color: #929292;
        opacity: 0.7;
        cursor: not-allowed;
    }
}`;

const GenderButton = styled(AntButton)<{ $isSelected: boolean }>`
    color: ${props => props.$isSelected ? '#00D282' : '#ccc'};
    border: 1px solid ${props => props.$isSelected ? '#00D282' : '#ccc'};
    
    &:hover, &:focus {
        border-color: ${props => props.$isSelected ? '#00D282' : '#ccc'};
    }

    &:active {
        background-color: ${props => props.$isSelected ? '#00D282' : '#ccc'};
        border-color: ${props => props.$isSelected ? '#00D282' : '#ccc'};
    }
`;