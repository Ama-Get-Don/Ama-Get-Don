import { Button, Form, Input, Typography, Select, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const { Title } = Typography;
const { Option } = Select;

export const Info = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleFinish = (values: any) => {
        console.log('Form Values: ', values);
    };

    const handleNext = () => {
        navigate('/sign-up/survey')
    }

    return (
        <Container>
            <Title level={2}>회원 정보</Title>
            <Form
                form={form}
                layout="horizontal"
                onFinish={handleFinish}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ width: 400, marginTop: 10 }}
            >
                <Form.Item
                    name="username"
                    label="아이디"
                    rules={[{ required: true, message: '아이디를 입력해주세요' }]}
                >
                    <Input placeholder="아이디" />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="비밀번호"
                    rules={[{ required: true, message: '비밀번호를 입력해주세요' }]}
                >
                    <Input.Password placeholder="비밀번호" />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="이메일 주소"
                    rules={[{ required: true, message: '이메일 주소를 입력해주세요', type: 'email' }]}
                >
                    <Input placeholder="이메일 주소" />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="휴대전화 번호"
                    rules={[{ required: true, message: '휴대전화 번호를 입력해주세요' }]}
                >
                    <Input placeholder="휴대전화 번호" />
                </Form.Item>

                <Form.Item
                    name="name"
                    label="이름"
                    rules={[{ required: true, message: '이름을 입력해주세요' }]}
                >
                    <Input placeholder="이름" />
                </Form.Item>
                <Form.Item
                    name="birthdate"
                    label="생년월일"
                    rules={[{ required: true, message: '생년월일을 입력해주세요' }]}
                >
                    <DatePicker style={{ width: '100%' }} placeholder="생년월일" />
                </Form.Item>
                <Form.Item
                    name="gender"
                    label="성별"
                    rules={[{ required: true, message: '성별을 선택해주세요' }]}
                >
                    <Select placeholder="성별">
                        <Option value="male">남성</Option>
                        <Option value="female">여성</Option>
                        <Option value="other">기타</Option>
                    </Select>
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24 }}>
                    <ButtonContainer>
                        <Button type="primary" htmlType="submit" onClick={handleNext}>
                            다음
                        </Button>
                    </ButtonContainer>
                </Form.Item>
            </Form>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    padding: 20px;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 100%;
`;
