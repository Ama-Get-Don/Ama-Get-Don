from fastapi import APIRouter
from user.interface.validators.user_validator import CreateUserBody, CreateInvestmentPreferenceBody, Token
from utils.security.auth import *
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
def create_user(user_create: CreateUserBody,
                investmentPreference_create: CreateInvestmentPreferenceBody,
                user_service: UserService = Depends(Provide[Container.user_service]),):
    created_user = user_service.create_user(user_create, investmentPreference_create)
    return created_user


@router.post("/login", response_model=Token)
@inject
def login_user(response:Response, form_data: OAuth2PasswordRequestForm = Depends(),
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

@router.post("/refresh", response_model=Token) # 리프레시 토큰으로 액세스 토큰, 리프레시 토큰 재발급하는 엔드포인트(RTR)
@inject
def renew_auth_tokens(refresh_token: str,
                      request:Request,
                      response:Response,
                user_service: UserService = Depends(Provide[Container.user_service]),):

    ip = get_client_ip(request)
    user_agent = get_user_agent(request)
    new_access_token, new_refresh_token = user_service.renew(refresh_token = refresh_token,
                                                             ip=ip, user_agent=user_agent)
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