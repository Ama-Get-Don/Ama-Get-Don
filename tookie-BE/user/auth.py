from jose import JWTError, jwt, ExpiredSignatureError
from user.settings import SECRET_KEY
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from enum import StrEnum

from dataclasses import dataclass
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from fastapi import Depends, HTTPException, status, Request

from database import *

#JWT 설정
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 2
REFRESH_TOKEN_EXPIRE_DAYS = 14
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
def decode_access_token(access_token: str): # 액세스 토큰 인증
    try:
        payload = jwt.decode(access_token, SECRET_KEY)
        return payload
    except ExpiredSignatureError: # 만료기한 초과
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token expired. Please use /refresh with your Refresh token."
        )
    except JWTError:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
def decode_refresh_token(refresh_token: str): # 리프레시 토큰 인증
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY)
        return payload
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token expired. Please re-login."
        )
    except JWTError:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
def verify_refresh_token(user_id: int, refresh_token:str, rd): # 인메모리 DB에 있는지 확인(관리자용)
    if rd.get(str(user_id)).decode("utf-8")==refresh_token:
        return True
    else:
        return False

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/login")

@dataclass
class CurrentUser:
    id: int
    level: int
    role: Role

def get_current_user(request:Request):
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No access token cookie")

    payload = decode_access_token(access_token)
    user_id = payload.get("user_id")
    role = payload.get("role")
    user_level = payload.get("user_level")
    if not user_id or not role or role!=Role.USER or not user_level or (user_level<1 or user_level>3):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    return CurrentUser(user_id, user_level, Role(role))