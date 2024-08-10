from passlib.context import CryptContext
from sqlalchemy.orm import Session

from user.user_schema import UserCreate
from user.user_schema import InvestmentPreferenceCreate

from models import User
from models import InvestmentPreference
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user(db: Session, user_create: UserCreate, investmentPreference_create: InvestmentPreferenceCreate):
    db_user = User(tookie_id = user_create.tookie_id,
                   name=user_create.name,
                   password=pwd_context.hash(user_create.password1),
                   email=user_create.email,
                   phone_number = user_create.phone_number,
                   birth = user_create.birth,
                   gender = user_create.gender,
                   investment_level = user_create.investment_level)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    db_quiz = InvestmentPreference(
        user_id=db_user.user_id,
        investment_goal=investmentPreference_create.investment_goal,
        risk_tolerance=investmentPreference_create.risk_tolerance,
        investment_ratio=investmentPreference_create.investment_ratio,
        investment_period=investmentPreference_create.investment_period,
        income_status=investmentPreference_create.income_status,
        derivatives_experience=investmentPreference_create.derivatives_experience
    )
    db.add(db_quiz)
    db.commit()

def get_existing_user(db: Session, user_create: UserCreate):
    return db.query(User).filter(
        (User.name == user_create.tookie_id) |
        (User.email == user_create.email)
    ).first()

def get_id(db: Session, id: str):
    return db.query(User).filter(User.tookie_id == id).first()