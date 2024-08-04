from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi import FastAPI, BackgroundTasks, Depends

from RAG.core_Rag import core_Rag
from Chat.core_Chat import core_Chat
from Dto.user_Message import user_Message

import json
import uvicorn
import asyncio

from starlette.middleware.cors import CORSMiddleware

from user import user_router

from database import get_db
from models import *
from sqlalchemy.orm import Session

def get_UserInfo(db: Session, user_id: int):
    user_info = db.query(InvestmentPreference).filter(InvestmentPreference.user_id==user_id).first()
    return user_info

app = FastAPI()
backend_json={} # 클라이언트에 넘길 데이터


# JSON에 사용자 정보 담는다(POST)
@app.post("/chat")
async def create_message(message: user_Message, db:Session = Depends(get_db)): # user_Message 형태로 매핑

    # 사용자 관련 정보
    ## 1) user_id 추출
    user_id = message.user_id
    ## 2) user_chat 추출
    user_chat = message.user_chat


    # 관계형 DB에 쿼리 날려서 user_info 자료구조 생성 -> 사용자에 대한 정보
    user_info = get_UserInfo(db, user_id)


    if not user_info:
        return {"message": "No user info found for the given user_id"}

    print("DB에서 가져온 데이터: 선호테이블 id", user_info.preference_id)
    print("DB에서 가져온 데이터: 유저 id(FK)", user_info.user_id)
    print("DB에서 가져온 데이터: 리스크 선호도", user_info.risk_preference)
    print("DB에서 가져온 데이터: 원하는 목표", user_info.investment_goal)
    print("DB에서 가져온 데이터: 투자기간", user_info.investment_horizon)

    backend_json[message.user_id] = {
        "question": user_chat,
        "user_info": user_info
    }


    return JSONResponse(content={"status": "ok"}, media_type="application/json; charset=utf-8")

# SSE 통신 (GET)
# user_id를 url에 담아서 사용자의 데이터를 구분한다.
@app.get("/stream/{user_id}")
async def stream(user_id: int):
    async def event_generator():
        while True:
            if user_id in backend_json:
                user_data = backend_json.pop(user_id)
                user_chat = user_data['user_chat']
                user_info = user_data['user_info']

                # core_Rag 함수에서 생성된 토큰을 스트리밍 형태로 클라이언트에 전송
                async for answer in core_Rag(user_chat, user_info):
                    yield f"data: {answer}\n\n"

                # 전체 응답을 core_Chat 함수에 전달
                full_response = ''.join([token async for token in core_Rag(user_chat, user_info)])
                core_Chat(user_chat, full_response)
                break  # 한 번 응답을 보낸 후 종료
            await asyncio.sleep(1)

    return StreamingResponse(event_generator(), media_type="text/event-stream")


origins = [

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router.router)
