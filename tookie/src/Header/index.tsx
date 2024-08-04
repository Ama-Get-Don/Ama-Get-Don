import { Layout, Menu } from 'antd';
import { HomeOutlined, InfoCircleOutlined, PhoneOutlined } from '@ant-design/icons';
import { styled } from 'styled-components';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  return (
    <HeaderStyled>
      <Logo>Tookie</Logo>
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
`;

const Logo = styled.div`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;