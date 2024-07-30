from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from Rag import core_Rag

app = FastAPI()

class Message(BaseModel):
    user: str
    text: str

questions = []
answers=[]

@app.post("/chat")
async def create_message(message: Message):
    questions.append(message)
    answer = core_Rag(message)
    answers.append(answer)
    return answer


