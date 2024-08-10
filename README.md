# Ama-Get-Don



## UI 개요

### 사용자 흐름 (User Flow)

이 프로젝트의 사용자 흐름은 사용자가 애플리케이션을 시작하여 챗봇과 상호 작용하는 데 있어 매끄러운 경험을 제공하도록 설계되었습니다. 주요 단계는 다음과 같습니다:

![alt text](readme_images/user_flow.png)

1. **시작**: 사용자는 애플리케이션을 시작하며 로그인 또는 회원가입 중 하나를 선택할 수 있습니다.
2. **회원가입 과정**: 사용자가 회원가입을 선택하면 다음의 단계를 거칩니다:
   - 약관에 동의
   - 개인정보 입력
   - 두 개의 설문 조사(사용자의 지식 수준과 투자 상황 파악)를 완료
   - 완료 후 챗봇 인터페이스로 이동
3. **챗봇 상호작용**: 사용자는 챗봇과 상호작용하여 다음을 수행할 수 있습니다:
   - 추천 질문을 통해 챗봇과 대화
   - 메시지를 입력하여 추가 질문
   - 개인정보를 확인 및 수정
   - 로그아웃 또는 캐릭터 성장 단계를 직접 변경

### UI 구성 요소

이 프로젝트에는 사용자 경험을 개선하기 위해 각각의 특정 기능을 가진 다양한 UI 구성 요소가 포함되어 있습니다:

#### 주요 페이지
1. **메인 페이지**
   - 로그인 또는 회원가입 옵션이 있는 메인 랜딩 페이지
   - 깔끔하고 최소한의 디자인으로 사용자가 다음 단계로 쉽게 진행할 수 있도록 유도

2. **로그인 페이지**
   - 기존 사용자를 위한 간단하고 직관적인 로그인 인터페이스

3. **회원가입 페이지**
   - **약관 동의**: 사용자는 약관에 동의해야 합니다.
   - **개인정보 입력**: 사용자가 개인 정보를 입력합니다.
   - **설문조사**: 사용자의 지식 수준과 투자 상황에 대한 두 가지 설문조사를 진행합니다.

#### 챗봇 인터페이스
1. **챗봇 채팅 페이지**
   - 사용자가 챗봇과 상호작용할 수 있는 핵심 인터페이스
   - 사용자 지식 수준에 따라 추천 질문이 제시됩니다
   - 챗봇이 사용자의 입력에 따라 응답하고 추가적인 안내를 제공합니다.
   - 챗봇을 통해 사용자에 맞게 투자를 조언 받을 수 있습니다. 

#### 프로필 및 설정
1. **내 정보 관리**
   - 사용자는 자신의 개인정보를 확인하고 수정할 수 있습니다.
   - 사용자는 인터페이스를 통해 캐릭터의 성장 단계를 직접 변경할 수 있어, 개인화된 경험을 제공합니다.

### UI 컨셉
- ‘투’자 능력 ‘키’우기 -> 서비스명: 투키(TOOKIE), 로고 설명(말풍선 안에 주식 그래프)
- 스투키(식물) 캐릭터를 성장시켜 나가는 컨셉
- 회원 가입 시 선택한 답변에 따라 첫 레벨이 결정됨
- 투자 초급자(씨앗) -> 투자 중급자(새순) -> 투자 고급자(투키)
- 캐릭터 레벨에 따라 제공되는 챗봇의 답변 수준이 달라짐
- 구현(첫 레벨이 결정되고, 사용자가 원하는 대로 성장 단계를 변경할 수 있음)
- 향후 계획(챗봇 대화량이나 중간 설문 등 구체적인 지표를 설정하여 사용자의 투자 능력이 성장되었다고 판단된다면 자동 레벨업)

### UI 디자인
- ‘성장’, ‘식물’ 이라는 컨셉 키워드에 따라 초록색을 대표 색상으로 설정
- 전체적으로 사용하기 쉽고 깔끔한 UI

### UI 캐릭터
- **씨앗 -> 새순 -> 투키**
- (씨앗)
   ![Seed](readme_images/seed.png)
- (새순)
   ![Sprout](readme_images/sprout.png)
- (투키)
   ![Seed](readme_images/tookie.png)
   
### UI 화면 

다음은 주요 인터페이스의 화면입니다:

1. **메인 페이지**: ![Main Page Screenshot](readme_images/main.png)
2. **로그인 페이지**: ![Login Page Screenshot](readme_images/login.png)
3. **회원가입 페이지**: ![Sign-Up Page Screenshot](readme_images/image_1.png)
   ![Sign-Up Page Screenshot 2](readme_images/image_2.png)
   ![Sign-Up Page Screenshot 3](readme_images/image_3.png)
4. **챗봇 채팅 페이지**: ![Chatbot Chat Page Screenshot](readme_images/chat_1.png)
   ![Chatbot Chat Page Screenshot 2](readme_images/chat_2.png)
5. **내 정보 페이지**: ![User Information Page Screenshot](readme_images/mypage.png)



