from database import *
from fastapi import Depends, HTTPException
from starlette.status import HTTP_429_TOO_MANY_REQUESTS

async def get_user_key(user_id:str) -> str:
    return f"rate_limit:{user_id}"

async def rate_limiter(user_key: str, rd=Depends(redis_config)):
    current = await rd.get(user_key) # current 값 가져옴

    if current is None:
        # 첫 요청: 카운트 1로 설정하고 TTL 부여
        pipe = rd.pipeline() # 파이프라인을 통해 밑 2개 한번에 처리(성능 up)
        pipe.set(user_key, 1) # current는 1부터 시작
        pipe.expire(user_key, WINDOW_SECONDS) # 타임 만료되면 사라짐
        await pipe.execute()
        return

    if int(current) >= RATE_LIMIT: # 만약 시간내에 현재 요청한 값이 RATE_LIMIT 이상이면
        raise HTTPException(
            status_code=HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please wait and try again."
        )
    else:
        await rd.incr(user_key) # current(value) 1증가