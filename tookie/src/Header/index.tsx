import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, InfoCircleOutlined, PhoneOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import tookieLogo from '../assets/tookie_logo.png';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('');
  };

  return (
    <HeaderStyled>
      <LogoWrapper onClick={handleLogoClick}>
        <LogoImage src={tookieLogo} alt="Tookie Logo" />
      </LogoWrapper>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<HomeOutlined />}>
          Home
        </Menu.Item>
        <Menu.Item key="2" icon={<InfoCircleOutlined />}>
          About
        </Menu.Item>
        <Menu.Item key="3" icon={<PhoneOutlined />}>
          Contact
        </Menu.Item>
      </Menu>
    </HeaderStyled>
  )
}

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
  height: 35px; // 로고 크기 조절 (필요에 따라 조정)
`;