from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from typing import Annotated
from chat.Chain.core_Chain import *
from chat.RAG.core_Rag import *

from langchain_openai import ChatOpenAI

import asyncio

from chat.Multi_Turn.core_Store import *

from utils.security.auth import get_current_user, CurrentUser
from config.logging_config import logger
from chat.interface.validators.chat_validator import ChatBody

from dependency_injector.wiring import inject, Provide
from chat.application.chat_service import ChatService
from containers import Container

from datetime import datetime

llm= ChatOpenAI(
    temperature=0.1,
    model_name = "gpt-4o",
)

router = APIRouter(
    prefix="/chat",
)

@router.post("/{session_id}")
@inject
async def create_message(session_id:str, message: ChatBody, current_user: Annotated[CurrentUser, Depends(get_current_user)],
                         chat_service: ChatService = Depends(Provide[Container.chat_service])):  # user_Message 형태로 매핑
    user_id = ""
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
    except Exception as e:
        raise HTTPException(status_code=500, detail="서버 오류")
'''
# SSE 통신 (GET)
@router.get("/stream")
async def stream(current_user: Annotated[CurrentUser, Depends(get_current_user)],):
    user_id = current_user.id
    logger.info(f"SSE 연결 요청 - user_id: {user_id}")

    async def event_generator():
        while True:
            if user_id in backend_json:
                user_data = backend_json.pop(user_id)
                user_chat = user_data['user_chat']
                user_info = user_data['user_info']
                investment_level = user_data['investment_level']
                logger.info(f"stream 데이터 처리 시작 - user_id: {user_id}, 질문: {user_chat[:30]}...")

                # 이전 대화 요약
                history_summary = summarize_history(user_id)
                print("대화맥락:", history_summary)

                new_user_chat = f"Previous Question and Answer Summary[{history_summary}]\n\n\n Present User Question: {user_chat}"

                # core_Chain 비동기 방식으로 실행
                rag_answer, agent_answer, company_answer = await core_Chain(new_user_chat, investment_level, user_info)
                print("Rag", rag_answer+"\n")
                print("Agent", agent_answer+"\n")
                print("Company", company_answer+"\n")

                # 3) core_Chain의 결과를 LLM이 종합(스트리밍 형태로 전송)
                full_response = ""
                for llm_token in llm.stream(f"{rag_answer}\n\n{agent_answer}\n\n{company_answer}의 내용을 종합해주세요!"):
                    yield f"data: {llm_token.content}\n\n"
                    full_response += llm_token.content
                yield "data: END\n\n"

                # 전체 응답을 core_Store 함수에 전달
                core_Store(user_id, new_user_chat.replace("Previous Question and Answer Summary", "").replace("Present User Question:", ""), full_response)
                insert_one(coll, user_id, new_user_chat, full_response)
                logger.info(f"stream 응답 전송 완료 - user_id: {user_id}")
                break  # 한 번 응답을 보낸 후 종료
            await asyncio.sleep(1)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
'''