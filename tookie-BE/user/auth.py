from jose import JWTError, jwt
from user.settings import SECRET_KEY
from fastapi import HTTPException, status
from datetime import datetime, timedelta

#JWT 설정
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
SECRET_KEY = SECRET_KEY
ALGORITHM = "HS256"

def create_access_token(id):
    data = {
        "sub": id,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    access_token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return access_token

def decode_access_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY)
    except JWTError:
        raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED)
