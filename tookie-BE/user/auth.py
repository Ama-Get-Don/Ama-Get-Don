from jose import JWTError, jwt
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

def decode_access_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY)
    except JWTError:
        raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/login")

@dataclass
class CurrentUser:
    id: int
    level: int
    role: Role

def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    payload = decode_access_token(token)
    user_id = payload.get("user_id")
    role = payload.get("role")
    user_level = payload.get("user_level")
    if not user_id or not role or role!=Role.USER or not user_level or (user_level<1 or user_level>3):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    return CurrentUser(user_id, user_level, Role(role))