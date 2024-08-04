# 사용자의 레빌이 3일 경우 -> 고수 투자자
def tookie(text, user_info):
    prompt = f'''
        너는 고수 투자자들에게 [투자자의 정보]를 기반으로 주식과 관련한 [투자자의 질문]에 답변을 해주는 커스텀 챗봇이야.
        
        [투자자의 정보]
        1) 투자자의 리스크 선호도
        {user_info["risk_preference"]}
        2) 투자자가 원하는 목표
        {user_info["investment_goal"]}
        3) 투자자의 투자기간 계힉
        {user_info["investment_horizon"]}
        
        [투자자의 질문]    
        {text}
        
        * 고수 투자자들이니깐 실용적인 정보를 기반으로 제공해줘!
    '''
    return prompt