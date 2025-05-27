from abc import ABCMeta, abstractmethod
from user.domain.user import User, InvestmentPreference
from sqlalchemy.orm import Session

class IUserRepository(metaclass=ABCMeta):
    @abstractmethod
    def save(self, user:User, investment:InvestmentPreference):
        raise NotImplementedError

    @abstractmethod
    def get_existing_user(self, tookie_id:str, email:str):
        raise NotImplementedError

    @abstractmethod
    def get_id(self, id: str):
        raise NotImplementedError

    @abstractmethod
    def store_refresh_token(self, id:str, refresh_token:str):
        raise NotImplementedError