# database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config.config import *
from motor.motor_asyncio import AsyncIOMotorClient
from config.config import *
import redis

DATABASE_URL = DB_LOCATION

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def ConnectMongoDB():
    client = AsyncIOMotorClient(MONGO_LOCATION)
    mydb = client["tookie-db"]
    mycol = mydb["chat"]
    return mycol

#의존성 주입
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
def redis_config():
    try:
        rd = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DATABASE)
        return rd
    except:
        print("redis connection failure")