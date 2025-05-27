from dataclasses import dataclass
from datetime import datetime

@dataclass
class InvestmentPreference:
    investment_goal: str
    risk_tolerance: str
    investment_ratio: str
    investment_period: str
    income_status: str
    derivatives_experience: str

@dataclass
class User:
    tookie_id: str
    name: str
    email: str
    phone_number: str
    password: str
    join_date: datetime
    birth: str
    gender: str
    investment_level: int

