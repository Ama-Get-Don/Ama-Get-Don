from pydantic import BaseModel, field_validator
MAX_INPUT_LENGTH = 2000
class ChatBody(BaseModel):
    user_chat: str

    @field_validator('user_chat')
    def passwords_match(cls, v):
        if len(v) > MAX_INPUT_LENGTH:
            raise ValueError(f"입력이 너무 깁니다. 최대 {MAX_INPUT_LENGTH}자를 초과했습니다.")
        return v
