from abc import ABCMeta, abstractmethod
from user.domain.user import User, InvestmentPreference
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

    def get_user_investment_preference(self, user_id: str):
        raise NotImplementedError
class ITokenRepository(metaclass=ABCMeta):
    @abstractmethod
    def save(self, key:str, value:str):
        raise NotImplementedError

    @abstractmethod
    def get(self, key: str):
        raise NotImplementedError

    @abstractmethod
    def remove(self, key: str):
        raise NotImplementedError
