# models.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database import Base
from enum import Enum as PyEnum
import datetime

class RiskPreference(PyEnum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

class InvestmentHorizon(PyEnum):
    SHORT_TERM = "Short Term"
    MEDIUM_TERM = "Medium Term"
    LONG_TERM = "Long Term"

class InvestmentLevel(PyEnum):
    Beginner = "Beginner"
    Intermediate = "Intermediate"
    Advanced = "Advanced"

class Gender(PyEnum):
    MALE = "Male"
    FEMALE = "Female"

class User(Base):
    __tablename__ = 'users'
    
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone_number = Column(String(100), nullable=True)
    password = Column(String(100), nullable=False)
    join_date = Column(DateTime, default=datetime.datetime.utcnow)
    gender = Column(Enum(Gender), nullable=True)
    investment_level = Column(Enum(InvestmentLevel), nullable=True)

    investments = relationship("InvestmentPreference", back_populates="user")

class InvestmentPreference(Base):
    __tablename__ = 'investment_preferences'
    
    preference_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    risk_preference = Column(Enum(RiskPreference), nullable=False)
    investment_goal = Column(String(100), nullable=True)
    investment_horizon = Column(Enum(InvestmentHorizon), nullable=False)
    
    user = relationship("User", back_populates="investments")