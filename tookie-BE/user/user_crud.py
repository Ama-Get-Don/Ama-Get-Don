from passlib.context import CryptContext
from sqlalchemy.orm import Session
from user.user_schema import UserCreate
from models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user(db: Session, user_create: UserCreate):
    db_user = User(name=user_create.name,
                   password=pwd_context.hash(user_create.password1),
                   email=user_create.email)
    db.add(db_user)
    db.commit()

def get_existing_user(db: Session, user_create: UserCreate):
    return db.query(User).filter(
        (User.name == user_create.name) |
        (User.email == user_create.email)
    ).first()

def get_user(db: Session, name: str):
    return db.query(User).filter(User.name == name).first()