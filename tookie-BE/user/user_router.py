from fastapi import APIRouter, HTTPException
from fastapi import Depends
from fastapi import Response
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from database import get_db
from user import user_crud, user_schema
from user.user_crud import pwd_context
from user.auth import *

from database import redis_config

router = APIRouter(
    prefix="/api/user",
)


@router.post("/create", status_code=status.HTTP_204_NO_CONTENT)
def user_create(user_create: user_schema.UserCreate, investmentPreference_create: user_schema.InvestmentPreferenceCreate, db: Session = Depends(get_db)):
    user = user_crud.get_existing_user(db, user_create=user_create)
    if user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="이미 존재하는 사용자입니다.")
    user_crud.create_user(db=db, user_create=user_create, investmentPreference_create= investmentPreference_create)


@router.post("/login", response_model=user_schema.Token)
def login_users(response:Response, form_data: OAuth2PasswordRequestForm = Depends(),
                           db: Session = Depends(get_db), rd=Depends(redis_config)):
    # id, pw 검증
    user = user_crud.get_id(db, form_data.username)
    if not user or not pwd_context.verify(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 액세스 토큰 발급
    access_token = create_access_token(
        payload = {"user_id": user.user_id, "user_level":user.investment_level}, role=Role.USER,
    )

    # 리프레시 토큰 발급
    refresh_token = create_refresh_token(
        payload = {"user_id": user.user_id, "user_level":user.investment_level}, role=Role.USER,
    )

    # 인메모리 DB에 저장(기존에 만료된 리프레시 토큰 있어도 덮어쓰기)
    rd.set(user.user_id, refresh_token)

    response.set_cookie(
        key="access_token",
        value = access_token,
        httponly=True,
        secure=True,
        samesite="None"
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="None"
    )
    return {"message": "Login Success"}

@router.post("/refresh", response_model=user_schema.Token) # 리프레시 토큰으로 액세스 토큰, 리프레시 토큰 재발급하는 엔드포인트(RTR)
def login_users(refresh_token: str, response:Response, rd=Depends(redis_config)):
    payload = decode_refresh_token(refresh_token) # 1차 검증(토큰 유효한지)
    if verify_refresh_token(payload.get("user_id"), refresh_token, rd)==False: # 2차 검증(인메모리 DB확인)
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token")

    new_access_token = create_access_token(
        payload = {"user_id": payload.get("user_id"), "user_level" : payload.get("user_level")}, role=Role.USER,
    )
    new_refresh_token = create_refresh_token(
        payload={"user_id": payload.get("user_id"), "user_level": payload.get("user_level")}, role=Role.USER,
    )

    rd.set(payload.get("user_id"), new_refresh_token)

    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        secure=True,
        samesite="None"
    )
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=True,
        samesite="None"
    )
    return {"message": "Reissuance Success"}