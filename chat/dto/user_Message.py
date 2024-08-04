from pydantic import BaseModel

class user_Message(BaseModel):
    # 투자자 id
    user_id: int

    # 투자자의 수준(seed, sprout, tookie)
    user_level: int

    # 투자자가 물어본 질문
    user_chat: str