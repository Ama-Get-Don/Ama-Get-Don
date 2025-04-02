from jose import JWTError, jwt, ExpiredSignatureError
from user.settings import SECRET_KEY
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from enum import StrEnum

from dataclasses import dataclass
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from fastapi import Depends, HTTPException, status


#JWT 설정
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
REFRESH_TOKEN_EXPIRE_DAYS = 2
SECRET_KEY = SECRET_KEY
ALGORITHM = "HS256"
class Role(StrEnum):
    ADMIN = "ADMIN"
    USER = "USER"

def create_access_token(payload:dict, role:Role):
    payload.update({
        "role": role,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    )
    access_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return access_token

def create_refresh_token(payload:dict, role:Role):
    payload.update({
        "role": role,
        "exp": datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    }
    )
    refresh_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return refresh_token


def decode_access_token(token: str):
    # 인증(만료기한까지)
    try:
        return jwt.decode(token, SECRET_KEY)
    except ExpiredSignatureError: # 만료기한 초과
        # 1) 인메모리 DB에서 액세스 토큰 검색
        # 2) 만약 있으면 리프레시 토큰의 만료기간 확인 후, 액세스 토큰 재발급 -> 인메모리 DB에서 키값(액세스 토큰)수정
        # 2) 만약 리프레시 토큰도 만료 되었으면 재로그인 요청 -> 인메모리 DB에서 해당 값 삭제

    except: # 인메모리 DB에 엑세스 토큰 없는 경우(재로그인)
        raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/login")

@dataclass
class CurrentUser:
    id: int
    level: int
    role: Role

def get_current_user(access_token: Annotated[str, Depends(oauth2_scheme)], refresh_token: Annotated[str, Depends(oauth2_scheme)]):
    payload = decode_access_token(access_token)
    user_id = payload.get("user_id")
    role = payload.get("role")
    user_level = payload.get("user_level")
    if not user_id or not role or role!=Role.USER or not user_level or (user_level<1 or user_level>3):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    return CurrentUser(user_id, user_level, Role(role))