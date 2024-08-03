import { Button, Input, Typography } from "antd";
import { styled } from "styled-components";

const { Title } = Typography;

export const Info = () => {
    return (
        <Container>
            <Title level={2}>회원 정보</Title>

            <StyledInput placeholder="아이디" />
            <StyledInput placeholder="비밀번호" />
            <StyledInput placeholder="이메일 주소" />
            <StyledInput placeholder="휴대전화 번호" />
            <Button type="primary" style={{ marginTop: 5, marginBottom: 20 }}>인증요청</Button>

            <StyledInput placeholder="이름" />
            <StyledInput placeholder="생년월일" />
            <StyledInput placeholder="이메일 주소" />
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

const StyledInput = styled(Input)`
  width: 300px;
  font-size: 16px;
`;