from fastapi import APIRouter, HTTPException
from starlette import status
from fastapi.responses import JSONResponse, StreamingResponse
from chat.dto.user_Message import *
from chat.Multi_Turn.core_Store import *
from chat.chat_crud import *
from fastapi import Depends
from chat.RAG.core_Rag import *
import asyncio
router = APIRouter(
    prefix="/chat",
)

backend_json = {}  # 클라이언트에 넘길 데이터


# JSON에 사용자 정보 담는다(POST)
@router.post("")
async def create_message(message: user_Message, db: Session = Depends(get_db)):  # user_Message 형태로 매핑

    # 사용자 관련 정보
    ## 1) user_id 추출
    user_id = message.user_id

    ## 2) user_chat 추출
    user_chat = message.user_chat
    
    ## 3) 쿼리 날려서 사용자 정보 추출
    '''
    # 관계형 DB에 쿼리 날려서 user_info 자료구조 생성 -> 사용자에 대한 정보
    user_info = get_UserInfo(db, user_id)

    if not user_info:
        return {"message": "No user info found for the given user_id"}
    else:
        print("DB에서 가져온 데이터: 선호테이블 id", user_info.preference_id)
        print("DB에서 가져온 데이터: 유저 id(FK)", user_info.user_id)
        print("DB에서 가져온 데이터: 리스크 선호도", user_info.risk_preference)
        print("DB에서 가져온 데이터: 원하는 목표", user_info.investment_goal)
        print("DB에서 가져온 데이터: 투자기간", user_info.investment_horizon)
    
    '''
    # 가자 테스팅 데이터
    mock_user_info = {
        "investment_goal": "예적금 수익률보다 3~5%정도 기대할 수 있다면 원금보존 가능성은 좀 포기할 수 있음",
        "risk_tolerance" : "투자원금은 반드시 보전",
        "investment_ratio" : "10%미만",
        "investment_period" : "1년 이하",
        "income_status" : "정기적 수입이 있으나, 향후 감소 또는 불안정이 예상됨",
        "derivatives_experience" : "1년 이상 3년 미만",
        "financial_vulnerability" : "해당 사항 없음"
    }
    user_info = mock_user_info

    backend_json[message.user_id] = {
        "user_chat": user_chat,
        "user_info": user_info
    }

    return JSONResponse(content={"status": "ok"}, media_type="application/json; charset=utf-8")


# SSE 통신 (GET)
# user_id를 url에 담아서 사용자의 데이터를 구분한다.
@router.get("/stream/{user_id}")
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

                # 전체 응답을 core_Store 함수에 전달
                full_response = ''.join([token async for token in core_Rag(user_chat, user_info)])
                core_Store(user_chat, full_response)
                break  # 한 번 응답을 보낸 후 종료
            await asyncio.sleep(1)

    return StreamingResponse(event_generator(), media_type="text/event-stream")