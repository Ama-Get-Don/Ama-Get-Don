from abc import ABCMeta, abstractmethod
from datetime import datetime
class IChatRepository(metaclass=ABCMeta):
    @abstractmethod
    async def find_session(self, session_id:str, user_id:str):
        raise NotImplementedError

    @abstractmethod
    async def update_chat(self, user_id:str, user_chat:str, session_id:str, chat_time:datetime):
        raise NotImplementedError

class ILimitRepository(metaclass=ABCMeta):
    @abstractmethod
    async def get(self, key: str):
        raise NotImplementedError

    @abstractmethod
    async def count(self, key:str):
        raise NotImplementedError

    @abstractmethod
    async def set_limit(self, user_key: str):
        raise NotImplementedError