from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from typing import Annotated
import asyncio
from utils.security.auth import get_current_user, CurrentUser
from utils.security.filter import filter_sensitive_info
from config.logging_config import logger
from chat.interface.validators.chat_validator import ChatBody
from dependency_injector.wiring import inject, Provide
from chat.application.chat_service import ChatService
from containers import Container
from datetime import datetime

router = APIRouter(
    prefix="/chat",
)

@router.post("/{session_id}")
@inject
async def create_message(session_id:str, message: ChatBody, current_user: Annotated[CurrentUser, Depends(get_current_user)],
                         chat_service: ChatService = Depends(Provide[Container.chat_service])):  # user_Message 형태로 매핑
    user_id = current_user.id # 토큰에서 user_id
    chat_time = datetime.utcnow()
    try:
        # 단위 시간당 한 계정의 요청 횟수 체크
        await chat_service.rate_limiter(user_id)
        # 민감 정보 필터링
        user_chat = await filter_sensitive_info(message.user_chat)
        # NoSQL에 질의 저장
        await chat_service.create_question(user_id, user_chat, session_id, chat_time)
        return JSONResponse(content={"status": "ok"}, media_type="application/json; charset=utf-8")
    except:
        raise HTTPException(status_code=500, detail="서버 오류")

# SSE
@router.get("/{session_id}")
@inject
async def stream(session_id:str, current_user: Annotated[CurrentUser, Depends(get_current_user)],
                 chat_service: ChatService = Depends(Provide[Container.chat_service])):
    user_id = current_user.id
    user_level = current_user.level
    async def event_generator():
        llm_response = ""
        async for llm_token in chat_service.stream_answer(session_id, user_id, user_level):
            yield f"data: {llm_token.content}\n\n"
            llm_response += llm_token.content
        yield "data: END\n\n"
        await chat_service.keep_multi_turn(session_id, user_id, llm_response)
        await asyncio.sleep(0.1)
    return StreamingResponse(event_generator(), media_type="text/event-stream")