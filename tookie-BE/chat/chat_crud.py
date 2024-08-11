from database import get_db
from models import *
from sqlalchemy.orm import Session
from pymongo import MongoClient
def ConnectMongoDB():
    client = MongoClient("mongodb://localhost:27017")
    mydb = client["tookie-db"]
    mycol = mydb["chat"]
    return mycol

def insert_one(coll, user_id, question, answer):
    chatdict = {
        "user_id" : user_id,
        "question" : question,
        "answer" : answer,
    }
    coll.insert_one(chatdict)
# 사용자 정보 GET
def get_UserInfo(db: Session, user_id: int):
    user_info = db.query(InvestmentPreference).filter(InvestmentPreference.user_id == user_id).first()
    return user_info