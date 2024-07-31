from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from RAG.core_Rag import core_Rag
from Chat.core_Chat import core_Chat
import json
import uvicorn


app = FastAPI()

class Message(BaseModel):
    user: str
    text: str


backend_json={}

@app.post("/chat")
async def create_message(message: Message):

    # 사용자 관련 정보중 텍스트 필드만 추가 (일단은)
    question = message.text
    answer = core_Rag(question)


    # 메모리에 저장(한번에)
    core_Chat(question, answer.response)

    # 사용자에 답변정보를 계속 추가(일단은) -> 나중에 사용자별로 채팅 내역 DB에 저장
    backend_json[message.user] = answer.response
    response_data = json.dumps(backend_json, ensure_ascii=False)
    return JSONResponse(content=json.loads(response_data), media_type="application/json; charset=utf-8")


