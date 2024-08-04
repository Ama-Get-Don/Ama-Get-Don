import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, InfoCircleOutlined, PhoneOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import tookieLogo from '../assets/tookie_logo.png'; // 이미지 import

const { Header } = Layout;

const AppHeader: React.FC = () => {
  return (
    <HeaderStyled>
      <LogoWrapper>
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