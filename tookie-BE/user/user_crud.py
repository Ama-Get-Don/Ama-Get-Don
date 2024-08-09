from passlib.context import CryptContext
from sqlalchemy.orm import Session
from user.user_schema import UserCreate
from models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user(db: Session, user_create: UserCreate):
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

def get_existing_user(db: Session, user_create: UserCreate):
    return db.query(User).filter(
        (User.name == user_create.name) |
        (User.email == user_create.email)
    ).first()

def get_id(db: Session, id: str):
    return db.query(User).filter(User.tookie_id == id).first()