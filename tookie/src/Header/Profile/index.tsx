import React, { useState } from 'react';
import { Avatar, Dropdown, Menu, Modal, Button } from 'antd';
import { UserOutlined, InfoCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import seedImage from '../../assets/profile_seed.png';
import sproutImage from '../../assets/profile_sprout.png';
import tookieImage from '../../assets/profile_tookie.png';
import maleImage from '../../assets/profile_male.png';

const Profile: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === 'myInfo') {
      setModalVisible(true); // 모달 열기
    } else if (e.key === 'logout') {
      navigate('/');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const menu = (
    <StyledMenu onClick={handleMenuClick}>
      <StyledMenuItem key="myInfo" style={{ color: 'white' }} icon={<InfoCircleOutlined />}>내 정보</StyledMenuItem>
      <div style={{ borderBottom: '1px solid white', margin: '5px 0' }} />
      <StyledMenuItem key="logout" style={{ color: 'white' }} icon={<LogoutOutlined />}>로그아웃</StyledMenuItem>
    </StyledMenu>
  );

  return (
    <>
      <Dropdown
        overlay={menu}
        trigger={['click']}
      >
        <ProfileAvatar>
          <Avatar icon={<UserOutlined />} />
        </ProfileAvatar>
      </Dropdown>

      <Modal
        title="내 정보"
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <StyledModalContent>
          <ProfileImage src={maleImage} alt="Profile" />
          <h3>현재 성장 단계</h3>
          <GrowthImage src={maleImage} alt="현재 성장 단계" />
          <h3>캐릭터 성장 단계</h3>
          <div>
            <GrowthImage src={seedImage} alt="씨앗" />
            <span>→</span>
            <GrowthImage src={sproutImage} alt="새순" />
            <span>→</span>
            <GrowthImage src={tookieImage} alt="투기" />
          </div>
          <Button type="primary" style={{ margin: '10px' }}>
            성장 단계 직접 변경하기
          </Button>
        </StyledModalContent>
      </Modal>
    </>
  );
};

export default Profile;

const ProfileAvatar = styled.div`
  cursor: pointer;
`;

const StyledMenu = styled(Menu)`
&&& {
  background: linear-gradient(to bottom, #86E158 100%, rgba(109, 221, 137, 0.8) 100%);
  background: linear-gradient(to bottom, #6DDD89 50%, rgba(109, 221, 137, 0.8) 100%);
}
`;

const StyledMenuItem = styled(Menu.Item)`
    &:hover {
      background-color: #00D282;
    }

    .ant-dropdown-menu-item-icon {
      color: white;
    }
  }
`;

const StyledModalContent = styled.div`
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
`;

const GrowthImage = styled.img`
  width: 50px;
  height: 50px;
  margin: 0 10px;
`;
