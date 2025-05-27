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

    @abstractmethod
    def imdb_set(self, key:str, value:str):
        raise NotImplementedError

    @abstractmethod
    def imdb_get(self, key: str):
        raise NotImplementedError

    @abstractmethod
    def imdb_del(self, key: str):
        raise NotImplementedError
