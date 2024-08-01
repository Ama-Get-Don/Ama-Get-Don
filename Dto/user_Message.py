from pydantic import BaseModel

class user_Message(BaseModel):
    user: str
    # 주식투자 경험
    # 주식에 쏟는 시간
    # 투자 전략
    # 정보분석 능력
    # 알고있는 주식 용어 수준
    text: str