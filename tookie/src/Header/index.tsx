import React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';
import tookieLogo from '../assets/tookie_logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import Profile from './Profile';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate('');
  };

  const handleLogout = () => {
    // 사용자 정보 초기화
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');  
    // 필요한 경우 더 많은 초기화 작업 수행
    
    // 홈 화면으로 리디렉션
    navigate('/');
  };

  const isLoggedIn = location.pathname.includes('/chat'); // chat 경로에 있을 때만 로그인된 것으로 간주

  return (
    <HeaderStyled>
      <LogoWrapper onClick={handleLogoClick}>
        <LogoImage src={tookieLogo} alt="Tookie Logo" />
      </LogoWrapper>
      {isLoggedIn && (
        <ProfileWrapper>
          <Profile />
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </ProfileWrapper>
      )}
    </HeaderStyled>
  );
};

export default AppHeader;

const HeaderStyled = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImage = styled.img`
  height: 35px;
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  padding: 0 15px;
`;

const LogoutButton = styled.button`
  margin-left: 15px;
  padding: 5px 10px;
  background-color: #f5222d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #ff4d4f;
  }
`;
