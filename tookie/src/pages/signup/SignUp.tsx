import { Button, Col, Row } from "antd"
import { styled } from "styled-components";

export const SignUp = () => {
    return (
        <Container>
            <StyledButton>아이디를 입력해주세요</StyledButton>
            <StyledButton>비밀번호를 입력해주세요</StyledButton>
            <StyledButton type="primary" shape="round">로그인</StyledButton>
            <Row>
                <Col>
                    비밀번호 찾기
                </Col>
                <Col style={{ marginLeft: 10, marginRight: 10 }}>|</Col>
                <Col>
                    아이디 찾기
                </Col>
            </Row>
        </Container>
    )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
`;

const StyledButton = styled(Button)`
  margin: 10px 0;
  width: 300px;
  font-size: 16px;
`;
