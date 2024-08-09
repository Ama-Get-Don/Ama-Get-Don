from pydantic import BaseModel, EmailStr, validator
from enum import Enum

class GenderEnum(str, Enum):
    남자 = "Male"
    여자 = "Female"

class UserCreate(BaseModel):
    name: str
    password: str
    email: EmailStr
    birthdate: str  
    phone_number: str
    gender: GenderEnum

    @validator('name', 'password', 'email', 'birthdate', 'phone_number')
    def not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('빈 값은 허용되지 않습니다.')
        return v

    class Config:
        use_enum_values = True


class Token(BaseModel):
    access_token: str
    token_type: str
    username: str
