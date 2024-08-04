from database import engine, Base
from models import User, InvestmentPreference 

Base.metadata.create_all(bind=engine)

