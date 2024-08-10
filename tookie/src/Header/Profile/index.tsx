import React, { useState, useEffect } from 'react';
import { Avatar, Dropdown, Menu, Modal, Button } from 'antd';
import { InfoCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import seedImage from '../../assets/profile_seed.png';
import sproutImage from '../../assets/profile_sprout.png';
import tookieImage from '../../assets/profile_tookie.png';
import maleImage from '../../assets/profile_male.png';
import femaleImage from '../../assets/profile_female.png';
import seedOnImage from '../../assets/seed_on.png';
import seedOffImage from '../../assets/seed_off.png';
import sproutOnImage from '../../assets/sprout_on.png';
import sproutOffImage from '../../assets/sprout_off.png';
import tookieOnImage from '../../assets/tookie_on.png';
import tookieOffImage from '../../assets/tookie_off.png';
import arrowImage from '../../assets/Arrow.png';

const Profile: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [growthModalVisible, setGrowthModalVisible] = useState(false); // 새로운 모달 상태
  const [selectedGender, setSelectedGender] = useState<string>('male');
  const [avatarImage, setAvatarImage] = useState<string>(maleImage);
  const [growthStage, setGrowthStage] = useState<string>('seed'); // 성장 단계 상태
  const navigate = useNavigate();

  // 성별 정보 받아오는 useEffect
  useEffect(() => {
    const fetchGenderFromDB = async () => {
      try {
        const response = await fetch('/api/user/gender'); // API 엔드포인트 예시
        const data = await response.json();
        setSelectedGender(data.gender);
      } catch (error) {
        console.error('Error fetching gender:', error);
      }
    };

    fetchGenderFromDB();
  }, []);

  // 성별에 따라 Avatar 이미지 설정 (성장 단계에 영향받지 않음)
  useEffect(() => {
    setAvatarImage(selectedGender === 'male' ? maleImage : femaleImage);
  }, [selectedGender]);

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === 'myInfo') {
      setModalVisible(true);
    } else if (e.key === 'logout') {
      navigate('/');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleGrowthStageChange = () => {
    setGrowthModalVisible(false); // 모달 닫기
    // 추가적으로 성장 단계 변경 후 서버로 상태를 전송하는 로직이 여기에 올 수 있음
  };

  const menu = (
    <StyledMenu onClick={handleMenuClick}>
      <StyledMenuItem key="myInfo" style={{ color: 'white' }} icon={<InfoCircleOutlined />}>내 정보</StyledMenuItem>
      <div style={{ borderBottom: '1px solid white', margin: '5px 0' }} />
      <StyledMenuItem key="logout" style={{ color: 'white' }} icon={<LogoutOutlined />}>로그아웃</StyledMenuItem>
    </StyledMenu>
  );

  const getCurrentGrowthImage = () => {
    if (growthStage === 'seed') {
      return seedImage;
    } else if (growthStage === 'sprout') {
      return sproutImage;
    } else if (growthStage === 'tookie') {
      return tookieImage;
    }
  };

  return (
    <>
      <Dropdown
        overlay={menu}
        trigger={['click']}
      >
        <ProfileAvatar>
          <Avatar src={avatarImage} />
        </ProfileAvatar>
      </Dropdown>

      <Modal
        title={<span style={{ fontSize: '24px', fontWeight: 'bold' }}>내 정보</span>}
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        <Spacer />
        <StyledModalContent>
          <div className="current-stage-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3>현재 성장 단계</h3>
              <GrowthImage src={getCurrentGrowthImage()} alt="현재 성장 단계" />
            </div>
            <StyledButton type="primary" shape="round" onClick={() => setGrowthModalVisible(true)} style={{ marginTop: '50px' }}>
              성장 단계 직접 변경하기
            </StyledButton>
          </div>
          <Spacer />
          <div className="growth-stage-section">
            <h3>캐릭터 성장 단계</h3>
            <div className="growth-images">
              <GrowthImage src={seedImage} alt="씨앗" style={{ width: '70px', height: '70px' }} />
              <img src={arrowImage} alt="화살표" className="arrow-image" style={{ margin: '0 10px', alignSelf: 'center', transform: 'translateY(-20px)' }} />
              <GrowthImage src={sproutImage} alt="새순" style={{ width: '70px', height: '70px' }} />
              <img src={arrowImage} alt="화살표" className="arrow-image" style={{ margin: '0 10px', alignSelf: 'center', transform: 'translateY(-20px)' }}/>
              <GrowthImage src={tookieImage} alt="투키" style={{ width: '70px', height: '70px' }} />
            </div>
          </div>
          <Spacer />
        </StyledModalContent>
      </Modal>

      <Modal
        title={<span style={{ fontSize: '24px', fontWeight: 'bold' }}>성장 단계 변경하기</span>}
        open={growthModalVisible}
        onCancel={() => setGrowthModalVisible(false)}
        footer={null}
        width={600}
      >
        <StyledModalContent>
          <h3>변경할 성장 단계를 선택하세요:</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <GrowthChooseImage
              src={growthStage === 'seed' ? seedOnImage : seedOffImage}
              alt="씨앗"
              onClick={() => setGrowthStage('seed')}
              style={{ cursor: 'pointer' }}
            />
            <GrowthChooseImage
              src={growthStage === 'sprout' ? sproutOnImage : sproutOffImage}
              alt="새순"
              onClick={() => setGrowthStage('sprout')}
              style={{ cursor: 'pointer' }}
            />
            <GrowthChooseImage
              src={growthStage === 'tookie' ? tookieOnImage : tookieOffImage}
              alt="투키"
              onClick={() => setGrowthStage('tookie')}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <StyledButton type="primary" shape="round" onClick={handleGrowthStageChange} style={{ marginTop: '20px' }}>
              변경하기
            </StyledButton>
          </div>
        </StyledModalContent>
      </Modal>
    </>
  );
};

export default Profile;

const ProfileAvatar = styled.div`
  cursor: pointer;
`;

const Spacer = styled.div`
    height: 25px;
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

const GrowthImage = styled.img`
  width: 50px;
  height: 50px;
  margin: 0 10px;
`;

const GrowthChooseImage = styled.img`
  width: 150px;
  height: 200px;
  margin: 0 10px;
`;

const StyledButton = styled(Button)`
  &&& {
    margin: 10px 0;
    width: 200px;
    height: 40px;
    font-size: 16px;
    background-color: #00D282;
    border-color: #00D282;
    color: white;

    &:hover, &:focus {
      background-color: #00B870;
      border-color: #00B870;
      color: white;
    }

    &:active {
      background-color: #009A5E;
      border-color: #009A5E;
    }

    &:disabled {
      background-color: #00D282;
      border-color: #00D282;
      color: white;
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
`;