from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

from chat.Prompt.keyword_extract import *
from chat.Prompt.question_extract import *
from chat.Prompt.seed import *
from chat.Prompt.sprout import *
from chat.Prompt.tookie import *

from config.config import *

api_key = OPENAI_API_KEY

import ast

def string_to_list(string):
    try:
        # ast.literal_eval을 사용하여 문자열을 평가
        result = ast.literal_eval(string)
        # 변환된 결과가 리스트인지 확인
        if isinstance(result, list):
            return result
        else:
            raise ValueError("The provided string does not represent a list.")
    except (ValueError, SyntaxError) as e:
        raise ValueError(f"Invalid input: {e}")

# OpenAI 모델 인스턴스 생성
extract_llm = ChatOpenAI(model="gpt-4o", temperature=0.8, openai_api_key=api_key)
answer_llm = ChatOpenAI(model="gpt-4o", temperature=0.7, openai_api_key=api_key)

# core_Chain 함수자체는 비동기로 호출한다.
async def core_Chain(question, investment_level, user_info):
    print("체인의 input으로 들어온 question", question)
    print("체인의 input으로 들어온 유저의 정보", user_info)

    ### 1)
    # 첫 번째 질문을 처리하는 체인 생성
    question_extract_prompt = question_extract(question)
    chain1 = question_extract_prompt | extract_llm | StrOutputParser()

    # 첫 체인 실행
    q_classification = chain1.invoke({})
    print("분류된 질문:", q_classification)

    # 결과를 리스트로 반환
    q_classification = string_to_list(q_classification)

    ### 2)
    # 두 번째 질문을 처리하는 체인 생성
    keyword_extract_prompt = keyword_extract(q_classification[1])
    chain2 = keyword_extract_prompt | extract_llm | StrOutputParser()

    # 두 번째 체인 실행 (첫 번째 질문의 리스트 중 두번째 결과(그외의 질문)를 기반으로)
    extracted_keywords = chain2.invoke({})
    print("추출된 키워드:", extracted_keywords)

    # 결과를 리스트로 반환
    extracted_keywords = string_to_list(extracted_keywords)

    # 1) 빙 API로 최신뉴스 GET -> extracted_keywords[0]
    '''
    여기에 빙 API 호출 코드를 작성하여 관련 뉴스를 가져옵니다.
    '''
    related_news = ""  # 이 부분은 실제 뉴스를 가져오는 코드로 대체해야 합니다.

    # 2) DB에서 재무제표 질의해서 회사 관련 정보 GET -> extracted_keywords[1]
    '''
    여기에 DB 질의 코드를 작성하여 회사 관련 정보를 가져옵니다.
    '''
    company_info = ""  # 이 부분은 실제 회사 정보를 가져오는 코드로 대체해야 합니다.

    # 3) 사용자 수준별로 다르게 질의
    # 세 번째 체인 실행 (최종 사용자 커스텀 질문)
    # 사용자 수준 별 다른 프롬프트 제공 (사용자에 대한 정보를 반영하여 맞춤형 답변을 준다)
    answer=""
    if investment_level == 1:
        seed_prompt = seed(question, user_info, related_news, company_info)
        seed_chain3 = seed_prompt | answer_llm | StrOutputParser()
        answer = seed_chain3.invoke({})
    elif investment_level == 2:
        sprout_prompt = sprout(question, user_info, related_news, company_info)
        sprout_chain3 = sprout_prompt | answer_llm | StrOutputParser()
        answer = sprout_chain3.invoke({})
    elif investment_level == 3:
        tookie_prompt = tookie(question, user_info, related_news, company_info)
        tookie_chain3 = tookie_prompt | answer_llm | StrOutputParser()
        answer = tookie_chain3.invoke({})

    print("최종질의(GPT-4o):", answer)
    return answer



