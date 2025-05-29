from chat.domain.repository.chat_repo import ILimitRepository, IChatRepository
from database import async_redis_config
from database import ConnectMongoDB
from datetime import datetime

class ChatRepository(IChatRepository):
    def __init__(self):
        self.db = ConnectMongoDB()

    async def find_session(self, session_id:str, user_id:str):
        data = await self.db.find_one({"session_id":session_id, "user_id":user_id})
        return data

    async def create_chat(self, user_id:str, user_chat:str, session_id:str, chat_time:datetime):
        user_message = {
            "timestamp": chat_time,
            "sender": "user",
            "text": user_chat
        }
        user_chat_data = {
            "session_id":session_id,
            "user_id":user_id,
            "history":"",
            "messages":[user_message]
        }
        await self.db.insert_one(user_chat_data)
        return

    async def update_chat(self, user_id:str, user_chat:str, session_id:str, chat_time:datetime):
        user_message = {
                "timestamp":chat_time,
                "sender":"user",
                "text": user_chat
            }
        result = await self.db.update_one(
                {"session_id": session_id, "user_id": user_id},
                {
                    "$push": {"messages": user_message},
                },
                upsert=True  # True로 하면 세션이 없을 때 새로 생성
            )
        return result.modified_count  # 1이면 성공, 0이면 실패(조건 불일치)

    async def save_history(self, session_id:str, user_id:str, user_history:str):
        result = await self.db.update_one(
            {"session_id": session_id, "user_id": user_id},
            {
                "$set": {"history": user_history}
            },)
        return result.modified_count
class LimitRepository(ILimitRepository):
    async def get(self, key: str):
        async with async_redis_config() as imdb:
            return await imdb.get(key)

    async def count(self, key:str):
        async with async_redis_config() as imdb:
            await imdb.incr(key)
    async def set_limit(self, user_key: str):
        async with async_redis_config() as imdb:
            # 첫 요청: 카운트 1로 설정하고 TTL 부여
            pipe = imdb.pipeline() # 파이프라인을 통해 밑 2개 한번에 처리(성능 up)
            await pipe.set(user_key, 1)  # current는 1부터 시작
            await pipe.expire(user_key, 60)  # 타임 만료되면 사라짐
            await pipe.execute()
