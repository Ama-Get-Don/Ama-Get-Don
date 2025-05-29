from dependency_injector.wiring import inject
from chat.domain.agent.llm_agent import ILLMChain
from chat.domain.repository.chat_repo import ILimitRepository, IChatRepository
from user.domain.repository.user_repo import IUserRepository
from fastapi import HTTPException
from starlette.status import HTTP_429_TOO_MANY_REQUESTS
import uuid
from datetime import datetime

RATE_LIMIT = 10
class ChatService:
    @inject
    def __init__(self, user_repo:IUserRepository, chat_repo:IChatRepository, limit_repo:ILimitRepository,
                 llm_chain:ILLMChain):
        self.user_repo = user_repo
        self.chat_repo = chat_repo
        self.limit_repo = limit_repo
        self.llm_chain = llm_chain
    async def rate_limiter(self, user_id:str):
        user_key = f"rate_limit:{user_id}"
        user_value = await self.limit_repo.get(user_key)

        if user_value is None:
            await self.limit_repo.set_limit(user_key)
        elif int(user_value) >= RATE_LIMIT:  # 만약 시간내에 현재 요청한 값이 RATE_LIMIT 이상이면
            raise HTTPException(
                status_code=HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Please wait and try again.")
        else:
            await self.limit_repo.count(user_key)  # current(value) 1증가
        return

    async def create_question(self, user_id:str, user_chat:str, session_id:str, chat_time:datetime):
        # 만약 session_id, user_id가 NoSQL DB에 존재하면, 대화를 이어서 진행
        if session_id=="" or (await self.chat_repo.find_session(session_id, user_id) is None):# 만약 session_id가 NoSQL DB에 존재하지 않거나 비어있으면, 세션ID 발급
            session_id = str(uuid.uuid4())
            await self.chat_repo.create_chat(user_id, user_chat, session_id, chat_time)
        else:
            await self.chat_repo.update_chat(user_id, user_chat, session_id, chat_time) # 세션 찾거나 새롭게 몽고 DB에 사용자 질의 저장
        return

    async def stream_answer(self, session_id:str, user_id:str, user_level:int):
        # 만약 session_id, user_id가 NoSQL DB에 존재하면
        user_chat_data = await self.chat_repo.find_session(session_id, user_id)
        if user_chat_data is not None:
            user_chat = user_chat_data["messages"][-1]["text"]
            user_investment_preference = self.user_repo.get_user_investment_preference(user_id)
            user_history = user_chat_data["history"]
            retrieved_docs = await self.llm_chain.run_rag(user_chat)

            if (await self.llm_chain.divide_chat(user_chat))=="K":
                async for token in self.llm_chain.ask_chat(retrieved_docs, user_level,user_investment_preference,
                                   user_history, user_chat):
                    yield token
            else:
                async for token in self.llm_chain.ask_chat(retrieved_docs, user_level,user_investment_preference,
                                             user_history, user_chat):
                    yield token

    # 버퍼의 값을 계속해서 히스토리에 업데이트하고, 히스토리에서 가져옴
    async def keep_multi_turn(self, session_id:str, user_id:str, llm_response:str):
        user_data = await self.chat_repo.find_session(session_id, user_id)
        print("유저의 데이터", user_data)
        # 만약 버퍼가 비었으면 히스토리를 가져와서 버퍼에 담음
        if (await self.llm_chain.pop_from_buffer(session_id)) == "":
            user_history = user_data['history']
            print("꺼내온 히스토리", user_history)
            await self.llm_chain.push_to_buffer(session_id, "user", user_history)

        # 현재 질의한 내용과 답변을 버퍼에 저장
        user_chat = user_data["messages"][-1]["text"]
        print("버퍼에 저장 시작", user_chat)
        await self.llm_chain.push_to_buffer(session_id, "user", user_chat)
        await self.llm_chain.push_to_buffer(session_id, "assistant", llm_response)

        # 버퍼에서 꺼내서 No SQL에 업데이트
        buffer_history = await self.llm_chain.pop_from_buffer(session_id)
        print("NosQL에 삽입", buffer_history)
        await self.chat_repo.save_history(session_id, user_id, buffer_history)

        return




