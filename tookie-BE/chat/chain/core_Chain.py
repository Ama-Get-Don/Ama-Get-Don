import os
from langchain import OpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain, SequentialChain
from chat.Prompt import *

print(os.environ["OPENAI_API_KEY"])

# OpenAI 모델 인스턴스 생성
extract_llm = OpenAI(model="GPT4", temperature=0.7)
answer_llm = OpenAI(model="GPT4o", temperature=0.7)

# 첫 번째 질문을 처리하는 체인 생성
chain1 = LLMChain(llm=extract_llm, prompt=question_extract(text))

# 두 번째 질문을 처리하는 체인 생성
chain2 = LLMChain(llm=extract_llm, prompt=keyword_extract(text))

# 세 번째 질문을 처리하는 체인 생성
seed_chain3 = LLMChain(llm=answer_llm, prompt=seed(text, user_info))
sprout_chain3 = LLMChain(llm=answer_llm, prompt=sprout(text, user_info))
tookie_chain3 = LLMChain(llm=answer_llm, prompt=tookie(text, user_info))

def core_Chain(question, investment_level, user_info):
    # 첫 체인 실행
    q_classification = chain1.run({"text": question})
    print("분류된 질문", q_classification)

    # 두 번째 체인 실행 (첫 번째 질문의 리스트 중 두번째 결과(그외의 질문)를 기반으로)
    extracted_keywords = chain2.run({"text": q_classification[1]})
    print("추출된 키워드:", extracted_keywords)

    # 1) 빙 API로 최신뉴스 GET -> extracted_keywords[0]
    '''
    
    '''
    related_news=""

    # 2) DB에서 재무제표 질의해서 회사 관련 정보 GET -> extracted_keywords[1]
    '''
    
    '''
    company_info=""

    # 3) 사용자 수준별로 다르게 질의
    # 세 번째 체인 실행 (최종 사용자 커스텀 질문)
    # 사용자 수준 별 다른 프롬프트 제공 (사용자에 대한 정보를 반영하여 맞춤형 답변을 준다)
    if investment_level == 1:
        answer = seed_chain3.run({"text": q_classification[1], "user_info":user_info, "related_news": related_news})
    elif investment_level == 2:
        answer = sprout_chain3.run({"text": q_classification[1], "user_info":user_info, "company_info":company_info})
    elif investment_level == 3:
        answer = tookie_chain3.run({"text": q_classification[1], "user_info":user_info})

    print("최종질의(GPT4o)", answer)
    return answer