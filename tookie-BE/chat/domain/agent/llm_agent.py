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

    @abstractmethod
    async def get_buffer(self, session_id: str):
        '''
        세션별 버퍼 객체 불러옴
        '''
        raise NotImplementedError

    @abstractmethod
    async def push_to_buffer(self, session_id: str, role: str, content: str):
        '''
        버퍼에 대화 저장
        '''
        raise NotImplementedError

    @abstractmethod
    async def pop_from_buffer(self, session_id: str):
        '''
        버퍼에서 히스토리 꺼냄
        '''
        raise NotImplementedError

