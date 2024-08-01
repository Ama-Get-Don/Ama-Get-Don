from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi import FastAPI, BackgroundTasks

from RAG.core_Rag import core_Rag
from Chat.core_Chat import core_Chat
from Dto.user_Message import user_Message

import json
import uvicorn


app = FastAPI()
backend_json={} # 클라이언트에 넘길 데이터

async def process_message(question: str, user_info: dict, user: str):
    # 질문과 사용자에 대한 정보 core_Rag로 넘겨서 LLM에게 답변 받는다.
    answer = await core_Rag(question, user_info)

    # 만약 answer 답변이 끝났으면
    # 버퍼에 저장(한번에: question, answer)
    core_Chat(question, answer)

    # 방금 질의한 사용자에 답변정보 저장 (클라이언트에 넘길거)
    backend_json[user] = answer

    print("사용자별 데이터: ", backend_json)

    '''

    '''
    # -> aws S3에 저장 예정

    return

# JSON에 사용자 정보 담는다(POST)
@app.post("/chat")
async def create_message(message: user_Message, background_tasks: BackgroundTasks): # user_Message 형태로 매핑

    # 사용자 관련 정보중 텍스트 필드만 추가 (일단은)
    question = message.text

    # 관계형 DB에 쿼리 날려서 user_info 자료구조 생성 -> 사용자에 대한 정보
    user_info={}
    '''
    
    '''
    #(구현 예정)

    background_tasks.add_task(process_message, question, user_info, message.user)

    return JSONResponse(content={"status": "ok"}, media_type="application/json; charset=utf-8")

# SSE 통신 (GET)
# 1) user_id를 url에 담아서 사용자의 데이터를 구분한다.
# 2)
'''
@app.get("/stream/{user_id}")
async def stream(request: Request):
    async def event_generator():
        while True:
            if await request.is_disconnected():
                break
            if backend_json:
                response_data = json.dumps(backend_json, ensure_ascii=False)
                yield f"data: {response_data}\n\n"
                await asyncio.sleep(1)  # Adjust this sleep time as needed

    return StreamingResponse(event_generator(), media_type="text/event-stream")
'''