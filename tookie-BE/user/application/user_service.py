from utils.security.crypto import Crypto
from datetime import datetime
from user.domain.user import User, InvestmentPreference
from user.domain.repository.user_repo import IUserRepository, ITokenRepository
from user.interface.validators.user_validator import CreateUserBody, CreateInvestmentPreferenceBody
from fastapi import HTTPException
from dependency_injector.wiring import inject

from fastapi import status
from utils.security.auth import create_access_token, create_refresh_token, Role, decode_refresh_token, make_black_list_key
class UserService:
    @inject
    def __init__(self, user_repo: IUserRepository, token_repo: ITokenRepository):
        self.user_repo = user_repo
        self.token_repo = token_repo
        self.crypto = Crypto()
    def create_user(self, user: CreateUserBody, investment:CreateInvestmentPreferenceBody):
        _user = None
        try:
            _user = self.user_repo.get_existing_user(user.tookie_id, user.email)
        except HTTPException as e:
            if e.status_code != 422:
                raise e
        if _user:
            raise HTTPException(status_code=422)
        now = datetime.now()

        # Pydantic -> 도메인
        user: User = User(
            tookie_id = user.tookie_id,
            name = user.name,
            email = user.email,
            phone_number = user.phone_number,
            password = self.crypto.encrypt(user.password1),
            join_date = now,
            birth = user.birth,
            gender = user.gender,
            investment_level = user.investment_level
        )

        investment: InvestmentPreference = InvestmentPreference(
            investment_goal= investment.investment_goal,
            risk_tolerance = investment.risk_tolerance,
            investment_ratio = investment.investment_ratio,
            investment_period = investment.investment_period,
            income_status = investment.income_status,
            derivatives_experience = investment.derivatives_experience)

        self.user_repo.save(user, investment)
        return user

    def login(self, id:str, password:str):
        user = self.user_repo.get_id(id)
        if not user or not self.crypto.verify(password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token = create_access_token(
            payload = {"user_id": user.user_id, "user_level":user.investment_level}, role=Role.USER,
        )

        refresh_token = create_refresh_token(
        payload = {"user_id": user.user_id, "user_level":user.investment_level}, role=Role.USER,
        )

        self.token_repo.save(user.user_id, refresh_token)

        return access_token, refresh_token

    def renew(self, refresh_token:str, ip:str, user_agent:str):
        payload = decode_refresh_token(refresh_token) # 1차 검증(토큰 유효한지)
        user_id = payload.get("user_id")
        user_level = payload.get("user_level")
        refresh_token_state = self.token_repo.get(refresh_token) # 리프레시 토큰의 전 사용여부 확인

        black_key = make_black_list_key(ip, user_agent) # 블랙리스트 키값 생성
        black_val = self.token_repo.get(black_key)
        # 블랙리스트에 있는지 확인
        if black_val is not None and black_val.decode("utf-8") == "True":
            print("블랙리스트에 해당 IP, User Agent 존재")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token")
        else:
            if refresh_token_state == None:  # 리프레시 토큰 재사용한적 없으면
                id_state = self.token_repo.get(user_id)
                if id_state == None:  # 해당 계정 리프레시 토큰 재사용으로 인한 삭제 -> 재로그인 필요
                    print("해당 계정 정상 사용자의 리프레시 토큰 지워짐, 재로그인 필요")
                    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
                else:
                    if id_state.decode("utf-8") == refresh_token:
                        new_access_token = create_access_token(
                            payload={"user_id": user_id, "user_level": user_level},
                            role=Role.USER,
                        )

                        new_refresh_token = create_refresh_token(
                            payload={"user_id": user_id, "user_level": user_level},
                            role=Role.USER,
                        )

                        self.token_repo.save(user_id, new_refresh_token)
                        self.token_repo.save(refresh_token, "True")  # 이미 썼던 리프레시 토큰은 True로 저장

                        return new_access_token, new_refresh_token
                    else:
                        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
            else:  # 만약 리프레시 토큰이 재사용되었으면
                # 인메모리 DB에서 해당 세션 지움
                self.token_repo.remove(user_id)

                # 블랙리스트 등록 "Black:HASH(IP+UserAgent) : True"
                self.token_repo.remove(black_key, "True")
                print("리프레시 토큰 재사용 됨")

                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Invalid token")

