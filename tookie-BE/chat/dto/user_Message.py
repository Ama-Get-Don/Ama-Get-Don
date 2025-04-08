from pydantic import BaseModel

class user_Message(BaseModel):
    # 투자자가 물어본 질문
    user_chat: str