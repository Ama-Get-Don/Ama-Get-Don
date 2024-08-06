import os
from langchain import OpenAI, LLMChain, PromptTemplate
from chat.Prompt import *

print(os.environ["OPENAI_API_KEY"])

# OpenAI 모델 인스턴스 생성
extract_llm = OpenAI(model="GPT4", temperature=0.7)
answer_llm = OpenAI(model="GPT4o", temperature=0.7)

# 첫 번째 체인
prompt_template_1 = PromptTemplate(
    input_variables=["input"],
    template=question_extract(input_variables)
)

# 두 번째 체인 (첫 번째 질문의 결과를 기반으로)
prompt_template_2 = PromptTemplate(
    input_variables=["input"],
    template=keyword_extract(input_variables)
)

# 세 번째 체인 (두 번째 질문의 결과를 기반으로) 메인 질의
prompt_template_3 = PromptTemplate(
    input_variables=["input"],
    template="Given the previous answer: {answer2}, Question: {input}\nAnswer:"
)

# 첫 번째 질문을 처리하는 체인 생성
chain1 = LLMChain(llm=extract_llm, prompt=prompt_template_1)
# 두 번째 질문을 처리하는 체인 생성
chain2 = LLMChain(llm=extract_llm, prompt=prompt_template_2)
# 세 번째 질문을 처리하는 체인 생성
chain3 = LLMChain(llm=answer_llm, prompt=prompt_template_3)


def core_Chain(question, user_info):
    # 첫 체인 실행
    q_classification = chain1.run({"input": question})
    print("분류된 질문", q_classification)

    # 두 번째 체인 실행 (첫 번째 질문의 리스트 중 두번째 결과(그외의 질문)를 기반으로)
    extracted_keywords = chain2.run({"input": q_classification[1]})
    print("추출된 키워드:", extracted_keywords)

    # 1) 빙 API로 최신뉴스 GET -> extracted_keywords[0]
    '''
    
    '''

    # 2) DB에서 재무제표 질의해서 GET -> extracted_keywords[1]
    '''
    
    '''

    # 3) 사용자 수준별로 다르게 질의
    # 세 번째 체인 실행 (최종 사용자 커스텀 질문)
    # 사용자 수준 별 다른 프롬프트 제공 (사용자에 대한 정보를 반영하여 맞춤형 답변을 준다)
    if user_info["level"] == 1:
        prompt = seed(message, user_info)
    elif user_info["level"] == 2:
        prompt = sprout(message, user_info)
    elif user_info["level"] == 3:
        prompt = tooki(message, user_info)

    answer = chain3.run({"input": q_classification[1], : answer2})
    print("최종질의(GPT4o)", answer)

    return answer