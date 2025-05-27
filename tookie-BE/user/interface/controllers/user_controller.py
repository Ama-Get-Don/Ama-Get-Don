from fastapi import APIRouter
from user.interface.validators.user_validate import CreateUserBody, CreateInvestmentPreferenceBody, Token
from user.security.auth import *
from user.application.user_service import UserService
from dependency_injector.wiring import inject, Provide
from containers import Container
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm

from fastapi import Response

router = APIRouter(
    prefix="/users",
)

@router.post("/create", status_code=status.HTTP_204_NO_CONTENT)
@inject
def user_create(user_create: CreateUserBody,
                investmentPreference_create: CreateInvestmentPreferenceBody,
                user_service: UserService = Depends(Provide[Container.user_service]),):
    created_user = user_service.create_user(user_create, investmentPreference_create)
    return created_user


@router.post("/login", response_model=Token)
@inject
def login_users(response:Response, form_data: OAuth2PasswordRequestForm = Depends(),
                user_service: UserService = Depends(Provide[Container.user_service]),):

    access_token, refresh_token = user_service.login(id = form_data.username, password = form_data.password,)

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="Strict"
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="Strict"
    )
    return {"message": "Login Success"}
'''
@router.post("/refresh", response_model=user_validate.Token) # 리프레시 토큰으로 액세스 토큰, 리프레시 토큰 재발급하는 엔드포인트(RTR)
def login_users(refresh_token: str, request:Request, response:Response, rd=Depends(redis_config)):
    payload = decode_refresh_token(refresh_token) # 1차 검증(토큰 유효한지)
    
    ip = get_client_ip(request) # ip추출
    ua = get_user_agent(request) # user_agent 추출
    
    if verify_refresh_token(payload.get("user_id"), refresh_token, rd, ip, ua)==False: # 2차 검증(인메모리 DB확인)
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
    rd.set(refresh_token, "True") # 이미 썼던 리프레시 토큰은 True로 저장

    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        secure=True,
        samesite="Strict"
    )
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=True,
        samesite="Strict"
    )
    return {"message": "Reissuance Success"}
'''