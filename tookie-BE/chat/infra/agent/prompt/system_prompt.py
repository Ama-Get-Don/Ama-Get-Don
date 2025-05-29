from user.infra.db_models.models import InvestmentPreference
async def create_divide_prompt(user_chat: str):
    return f'''
    너는 사용자 질문이 **한국**에 대한 것인지 **미국 등 해외 **에 대한 것인지 구분하는 분류 모델 역할을 맡았어.

    [질문 예시]
    - "삼성전자 오늘 주가 어때?" → 한국 주식 → K
    - "애플 실적 발표 언제야?" → 해외 주식 → F
    - "주식 배당 기준일은 어떻게 돼?" → 일반적 내용 (판단이 어려우면 보통 K로 분류)
    - "테슬라 주가 전망 알려줘" → 해외 주식 → F

    [판단 기준]
    - 국내 기업 이름 (삼성전자, 현대차, 네이버 등)이 포함되면 → K
    - 해외 기업 이름 (Apple, Tesla, Microsoft 등)이 포함되면 → F
    - KRX, 코스피, 코스닥 등 국내 용어 포함 시 → K
    - NASDAQ, NYSE, 다우지수 등 해외 용어 포함 시 → F
    - 중립적이거나 일반적인 금융 용어는 → K 로 처리

    [출력 형식]
    - 해외 관련이면 **F**
    - 한국 관련이면 **K**
    
    질문: "{user_chat}"

    답변은 반드시 F 또는 K 중 하나로만 출력해.'''

async def create_ask_prompt(retrieved_documents:str, user_level:int, user_investment_preferences:InvestmentPreference, user_history:str, user_chat:str):
    if user_level==1:
        user_level="초보 투자자"
    elif user_level==2:
        user_level="중급 투자자"
    else:
        user_level="고수 투자자"

    return f'''
        [사용자의 투자관련 정보]
        1) 투자목적
        {user_investment_preferences.investment_goal}
        2) 위험감수능력
        {user_investment_preferences.risk_tolerance}
        3) 투자비중
        {user_investment_preferences.investment_ratio}
        4) 투자 기간
        {user_investment_preferences.investment_period}
        5) 소득 상태
        {user_investment_preferences.income_status}
        6) 투자 경험
        {user_investment_preferences.derivatives_experience}

        [사용자의 질문]    
        {user_chat}
        
        [관련한 문서 정보]
        {retrieved_documents}
        
        [지금까지 사용자의 대화 요약]
        {user_history}
        
        너는 {user_level}에게 [사용자의 투자관련 정보] 기반으로 주식과 관련한 [사용자의 질문]에 답변을 해주는 커스텀 챗봇이야.
        [회사의 재무제표] 정보는 비어있을 수도 있어!

        답변을 줄때 [주의사항]을 반드시 참고해줘!

        [주의 사항]
        1) 한국어로 대답해줘.투자 조언은 구체적인 수치를 기반으로 대답해줘.
        2) 투자나 금융과 관련하지 않은 [사용자의 질문]에는 "투자나 금융관련 정보에만 답변할 수 있어요!"를 반환해줘!
    '''