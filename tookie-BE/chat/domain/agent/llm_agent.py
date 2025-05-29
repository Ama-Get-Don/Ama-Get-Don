from abc import ABCMeta, abstractmethod
from user.infra.db_models.models import InvestmentPreference
class ILLMChain(metaclass=ABCMeta):
    @abstractmethod
    async def divide_chat(self, user_chat:str):
        '''
        한국/해외 분리
        '''
        raise NotImplementedError

    @abstractmethod
    async def run_rag(self, user_chat:str):
        '''
        관련 청크 추출
        '''
        raise NotImplementedError

    @abstractmethod
    async def ask_chat(self, retrieved_docs:str, user_level:int,
                            user_investment_preferences:InvestmentPreference,
                            user_history:str, user_chat:str):
        '''
        최종 LLM에 질의
        '''
        raise NotImplementedError