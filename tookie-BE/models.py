from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey  # ForeignKey 추가
from sqlalchemy.orm import relationship
from database import Base
from enum import Enum as PyEnum
import datetime

class InvestmentGoal(PyEnum):
    LOW = "원금보존 가능성을 포기하기 어렵기 때문에 예적금 수익률 보다 1~2%정도만 더 나오면 됨"
    MEDIUM = "예적금 수익률보다 3~5%정도 기대할 수 있다면 원금보존 가능성은 좀 포기할 수 있음"
    HIGH = "고수익을 기대하고 있으며, 원금손실 가능성은 감수할 수 있음"

class RiskTolerance(PyEnum):
    NO_LOSS = "투자원금은 반드시 보전"
    SOME_LOSS = "약간 손실 감수 가능"
    HIGH_LOSS = "높은 기대수익을 위해서 높은 위험 감수 가능"

class InvestmentRatio(PyEnum):
    LESS_THAN_10 = "10%미만"
    BETWEEN_10_AND_30 = "10%이상 30% 미만"
    MORE_THAN_30 = "30% 이상"

class InvestmentPeriod(PyEnum):
    LESS_THAN_1_YEAR = "1년 이하"
    BETWEEN_1_AND_5_YEARS = "1-5년"
    MORE_THAN_5_YEARS = "5년 이상"

class IncomeStatus(PyEnum):
    STABLE = "정기적 수입이 있으며, 향후 현재 수준의 유지 또는 증가가 예상됨"
    UNSTABLE = "정기적 수입이 있으나, 향후 감소 또는 불안정이 예상됨"
    NO_INCOME = "현재 정기적 수입이 없음"

class DerivativesExperience(PyEnum):
    LESS_THAN_1_YEAR = "1년 미만"
    BETWEEN_1_AND_3_YEARS = "1년 이상 3년 미만"
    MORE_THAN_3_YEARS = "3년 이상"

class Gender(PyEnum):
    MALE = "Male"
    FEMALE = "Female"

class User(Base):
    __tablename__ = 'users'
    
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone_number = Column(String(20), nullable=True)  # 길이 지정
    password = Column(String(100), nullable=False)
    join_date = Column(DateTime, default=datetime.datetime.utcnow)
    gender = Column(Enum(Gender), nullable=True)
    birthdate = Column(String(10), nullable=True)  # 길이 지정
    investment_level = Column(Integer, nullable=True)

    investments = relationship("InvestmentPreference", back_populates="user")

class InvestmentPreference(Base):
    __tablename__ = 'investment_preferences'
    preference_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    investment_goal = Column(Enum(InvestmentGoal), nullable=False)
    risk_tolerance = Column(Enum(RiskTolerance), nullable=False)
    investment_ratio = Column(Enum(InvestmentRatio), nullable=False)
    investment_period = Column(Enum(InvestmentPeriod), nullable=False)
    income_status = Column(Enum(IncomeStatus), nullable=False)
    derivatives_experience = Column(Enum(DerivativesExperience), nullable=False)

    user = relationship("User", back_populates="investments")
