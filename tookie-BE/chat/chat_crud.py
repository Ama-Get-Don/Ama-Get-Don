from database import get_db
from models import *
from sqlalchemy.orm import Session

# 사용자 정보 GET
def get_UserInfo(db: Session, user_id: int):
    user_info = db.query(InvestmentPreference).filter(InvestmentPreference.user_id == user_id).first()
    return user_info