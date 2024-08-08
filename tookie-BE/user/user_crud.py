from passlib.context import CryptContext
from sqlalchemy.orm import Session
from .user_schema import UserCreate
from models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user(db: Session, user_create: UserCreate):
    db_user = User(
        name=user_create.name,
        password=pwd_context.hash(user_create.password),
        email=user_create.email,
        birthdate=user_create.birthdate, 
        phone_number=user_create.phone_number,
        gender=user_create.gender
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_existing_user(db: Session, user_create: UserCreate):
    return db.query(User).filter(
        (User.name == user_create.name) |
        (User.email == user_create.email)
    ).first()

def get_user(db: Session, name: str):
    return db.query(User).filter(User.name == name).first()
