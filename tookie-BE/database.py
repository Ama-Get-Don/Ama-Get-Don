# database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config.config import *

DATABASE_URL = DB_LOCATION

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

#의존성 주입
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()