from user.domain.repository.user_repo import IUserRepository
from user.domain.user import User as UserV0, InvestmentPreference as InvestmentPreferenceV0
from user.infra.db_models.models import User, InvestmentPreference
from database import SessionLocal
from database import redis_config
class UserRepository(IUserRepository):
    def save(self, user: UserV0, investment:InvestmentPreferenceV0):
        db_user = User(tookie_id = user.tookie_id,
                   name=user.name,
                   password= user.password,
                   email=user.email,
                   phone_number = user.phone_number,
                   birth = user.birth,
                   gender = user.gender,
                   investment_level = user.investment_level)
        with SessionLocal() as db:
            db.add(db_user)
            db.commit()
            db.refresh(db_user)

        db_investment = InvestmentPreference(
            user_id=db_user.user_id,
            investment_goal=investment.investment_goal,
            risk_tolerance=investment.risk_tolerance,
            investment_ratio=investment.investment_ratio,
            investment_period=investment.investment_period,
            income_status=investment.income_status,
            derivatives_experience=investment.derivatives_experience)
        with SessionLocal() as db:
            db.add(db_investment)
            db.commit()

    def get_existing_user(self, tookie_id:str, email:str)->User:
        with SessionLocal() as db:
            return db.query(User).filter(
                    (User.name == tookie_id) |
                    (User.email == email)
                ).first()

    def get_id(self, id: str) -> User:
        with SessionLocal() as db:
            return db.query(User).filter(User.tookie_id == id).first()

    def store_refresh_token(self, id:str, refresh_token:str):
        with redis_config() as rdb:
            rdb.set(id, refresh_token)
