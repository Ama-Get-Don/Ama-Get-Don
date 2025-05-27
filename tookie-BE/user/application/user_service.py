from utils.crypto import Crypto
from datetime import datetime
from user.domain.user import User, InvestmentPreference
from user.domain.repository.user_repo import IUserRepository
from user.interface.validators.user_validate import CreateUserBody, CreateInvestmentPreferenceBody
from fastapi import HTTPException
from dependency_injector.wiring import inject

class UserService:
    @inject
    def __init__(self, user_repo: IUserRepository, ):
        self.user_repo = user_repo
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