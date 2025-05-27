from jose import JWTError, jwt, ExpiredSignatureError
from datetime import datetime, timedelta
from enum import StrEnum

from dataclasses import dataclass
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException, status
import hashlib
from database import *
from fastapi import Request

#JWT 설정
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 2
REFRESH_TOKEN_EXPIRE_DAYS = 14
SECRET_KEY = SECRET_KEY
ALGORITHM = "HS256"
class Role(StrEnum):
    ADMIN = "ADMIN"
    USER = "USER"

def get_client_ip(request:Request):
    x_forwarded_for = request.headers.get("X-Forwarded-For")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0]
    return request.client.host

def get_user_agent(request:Request):
    return request.headers.get("User-Agent", "unknown")
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

def make_black_list_key(ip:str, ua:str):
    target=(ip+ua)
    key = hashlib.sha256(target.encode()).hexdigest()
    black_key = f"BlackList-{key}"
    return black_key

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/login")

@dataclass
class CurrentUser:
    id: str
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