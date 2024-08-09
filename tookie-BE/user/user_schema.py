# user_schema.py
from pydantic import BaseModel, EmailStr, field_validator
from pydantic_core.core_schema import FieldValidationInfo
import datetime


class UserCreate(BaseModel):
    tookie_id : str
    name: str
    password1: str
    password2: str
    email: EmailStr
    phone_number: str
    birth:str
    gender: str
    investment_level: int

    @field_validator('tookie_id', 'name', 'password1', 'password2', 'email', 'phone_number', 'birth', 'gender')
    def not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('빈 값은 허용되지 않습니다.')
        return v

    @field_validator('password2')
    def passwords_match(cls, v, info: FieldValidationInfo):
        if 'password1' in info.data and v != info.data['password1']:
            raise ValueError('비밀번호가 일치하지 않습니다')
        return v

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    tookie_id: str