from jose import JWTError, jwt, ExpiredSignatureError
from user.settings import SECRET_KEY
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from enum import StrEnum

from dataclasses import dataclass
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from fastapi import Depends, HTTPException, status, Request
import hashlib
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

def make_black_list_key(ip:str, ua:str):
    target=(ip+ua)
    key = hashlib.sha256(target.encode()).hexdigest()
    black_key = f"BlackList-{key}"
    return black_key
def verify_refresh_token(user_id: str, refresh_token:str, rd, ip:str, ua:str): # 인메모리 DB에 있는지 확인(관리자용)
    rt_state = rd.get(refresh_token) # 리프레시 토큰의 전 사용여부 확인
    black_key = make_black_list_key(ip, ua) # 블랙리스트 키값 생성
    # 블랙리스트에 있는지 확인
    if rd.get(black_key).decode("utf-8")=="True":
        print("블랙리스트에 해당 IP, User Agent 존재")
        return False
    else:
        if rt_state==None: # 리프레시 토큰 재사용한적 없으면
            id_state = rd.get(user_id)
            if id_state==None: # (해당 계정 리프레시 토큰 재사용으로 인한 삭제 or 관리자가 임의로 삭제) -> 재로그인 필요
                print("해당 계정 정상 사용자의 리프레시 토큰 지워짐, 재로그인 필요")
                return False
            else:
                if id_state.decode("utf-8")==refresh_token:
                    return True
                else:
                    return False
        else: #만약 리프레시 토큰이 재사용되었으면
            # 인메모리 DB에서 해당 세션 지움
            rd.delete(user_id)
            # 블랙리스트 등록 "Black:HASH(IP+UserAgent) : True"
            rd.set(black_key, "True")
            print("리프레시 토큰 재사용 됨")
            return False

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