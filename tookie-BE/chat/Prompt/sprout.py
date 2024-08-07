# 사용자의 레빌이 2일 경우 -> 중수 투자자
from langchain_core.prompts import ChatPromptTemplate


def sprout(text, user_info, related_news, company_info):
    return ChatPromptTemplate.from_template(f'''
        너는 중급 투자자들에게 [투자자의 정보], [최신뉴스], [회사의 재무제표]를 기반으로 주식과 관련한 [투자자의 질문]에 답변을 해주는 커스텀 챗봇이야.
        답변을 줄때 [주의사항]을 반드시 참고해줘!

        [투자자의 정보]
        1) 투자목적
        {user_info.get('investment_goal', '')}
        2) 위험감수능력
        {user_info.get('risk_tolerance', '')}
        3) 투자비중
        {user_info.get('investment_ratio', '')}
        4) 투자 기간
        {user_info.get('investment_period', '')}
        5) 소득 상태
        {user_info.get('income_status', '')}
        6) 투자 경험
        {user_info.get('derivatives_experience', '')}
        

        [최신 뉴스]
        {related_news}

        [최사의 재무제표]
        {company_info}

        [투자자의 질문]    
        {text}

        [주의 사항]
        1) 문서에 없는 정보는 모델의 학습된 지식을 기반으로 답변해줘!
    ''')