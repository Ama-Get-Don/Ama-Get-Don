from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel


app = FastAPI()

class Message(BaseModel):
    user: str
    text: str

messages = []

@app.post("/messages/")
async def create_message(message: Message):
    messages.append(message)
    return message

@app.get("/messages/")
async def get_messages():
    return messages