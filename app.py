from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from RAG import core_Rag
import json
import uvicorn

app = FastAPI()

class Message(BaseModel):
    user: str
    text: str

questions = []
answers=[]
backend_json={}

@app.post("/chat")
async def create_message(message: Message):

    # 사용자 관련 정보중 텍스트 필드만 추가 (일단은)
    questions.append(message.text)
    answer = core_Rag(message.text)
    answers.append(answer.text)
    backend_json[message.user] = message.text

    response_data = json.dumps(backend_json, ensure_ascii=False)
    return JSONResponse(content=json.loads(response_data), media_type="application/json; charset=utf-8")


