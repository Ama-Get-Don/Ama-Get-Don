from fastapi import APIRouter
from user.interface.validators.user_validate import CreateUserBody, CreateInvestmentPreferenceBody
from user.auth import *

from user.application.user_service import UserService
from dependency_injector.wiring import inject, Provide
from containers import Container
from fastapi import Depends

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

'''
@router.post("/login", response_model=user_validate.Token)
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