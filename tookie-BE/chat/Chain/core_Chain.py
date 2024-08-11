import os
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

from chat.Prompt.company_extract import *
from chat.Prompt.question_extract import *
from chat.Prompt.seed import *
from chat.Prompt.sprout import *
from chat.Prompt.tookie import *

import ast

from config.config import *

from langchain_community.utilities import GoogleSerperAPIWrapper
from langchain_community.document_loaders import PyPDFLoader

from langchain_core.tools import Tool
from langchain.agents import AgentType, initialize_agent

from chat.RAG.core_Rag import *

os.environ["SERPER_API_KEY"] = SEARCH_KEY
api_key = OPENAI_API_KEY
async def string_to_list(string):
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
extract_llm = ChatOpenAI(model="gpt-4o", temperature=0.2, openai_api_key=api_key)
answer_llm = ChatOpenAI(model="gpt-4o", temperature=0.7, openai_api_key=api_key)
agent_llm = ChatOpenAI(model="gpt-4", temperature=0, openai_api_key=api_key)

# core_Chain 함수자체는 비동기로 호출한다.
async def core_Chain(question, investment_level, user_info):
    print("체인의 input으로 들어온 question", question)
    print("체인의 input으로 들어온 유저의 정보", user_info)

    ### 1)
    # 체인 생성(질문 쪼개는 체인)
    question_extract_prompt = await question_extract(question)
    chain1 = question_extract_prompt | extract_llm | StrOutputParser()

    # 체인 실행
    q_classification = await chain1.ainvoke({})
    print("분류된 질문:", q_classification)

    # 결과를 리스트로 반환
    q_classification = await string_to_list(q_classification)

    # 체인 기반으로 질문들의 유형이 쪼개짐
    ## 가. q_clssification[0] -> RAG
    ## 나. q_classification[1] -> 투자관련 Question
    ## 다. agent 기반 검색

    rag_answer=""
    ## 가. RAG (순수하게 RAG 방식)
    if len(q_classification[0])!=0:
        rag_answer = await core_Rag(q_classification[0])

    ## 나. 투자 Main
    # 체인 생성
    main_answer = ""
    if len(q_classification[1]) != 0:
        company_extract_prompt = await company_extract(q_classification[1])
        chain2 = company_extract_prompt | extract_llm | StrOutputParser()

        # 체인 실행해서 회사명 추출
        extracted_company = await chain2.ainvoke({})
        print("추출된 회사:", extracted_company)
        company_info = ""
        if len(extracted_company)!=0:
            # 결과를 리스트로 반환
            extracted_company = await string_to_list(extracted_company)

            # 추출한 단어 기반으로 정보 GET(재무제표)
            # 해당 회사의 재무제표 파일을 임베딩해서 넣는다.
            for company in extracted_company:
                file_path = f"./financial_statements/{company}.pdf"

                # 파일이 존재하는지 확인
                if os.path.exists(file_path):
                    try:
                        loader = PyPDFLoader(file_path)
                        documents = loader.load()
                        for document in documents:
                            company_info += document.page_content
                    except Exception as e:
                        print(f"An error occurred while processing {file_path}: {e}")
                else:
                    print(f"File {file_path} does not exist.")

        ### 3> 사용자 수준별로 다르게 회사정보 기반으로 질의
        # 사용자 수준 별 다른 프롬프트 제공 (사용자에 대한 정보를 반영하여 맞춤형 답변을 준다)
        if investment_level == 1:
            seed_prompt = await seed(question, user_info, company_info)
            seed_chain3 = seed_prompt | answer_llm | StrOutputParser()
            main_answer = await seed_chain3.ainvoke({})

        elif investment_level == 2:
            sprout_prompt = await sprout(question, user_info, company_info)
            sprout_chain3 = sprout_prompt | answer_llm | StrOutputParser()
            main_answer = await sprout_chain3.ainvoke({})

        elif investment_level == 3:
            tookie_prompt = await tookie(question, user_info, company_info)
            tookie_chain3 = tookie_prompt | answer_llm | StrOutputParser()
            main_answer = await tookie_chain3.ainvoke({})


    agent_answer=""
    if main_answer =="No-Knowledge":
        ## 나. 그 외 질문: Agent 기반 검색 수행(self-ask-with-search) -> 최대한 팩트기반으로 최신정보
        # 사용자 수준 별 다른 프롬프트 제공 (사용자에 대한 정보를 반영하여 맞춤형 답변을 준다)
        search = GoogleSerperAPIWrapper()
        tools = [
            Tool(
                name="Intermediate Answer",
                func=search.run,
                description="useful for when you need to ask with search",
                handle_parsing_errors=True,
                )
            ]
        self_ask_with_search = initialize_agent(
            tools, agent_llm, agent=AgentType.SELF_ASK_WITH_SEARCH, verbose=True
        )
        agent_answer = self_ask_with_search.run(f"투자자의 질문:{q_classification[1]}, 투자자의 정보:{user_info} 반드시 한국어로 답변해줘! Please Answer me Korean!")


    return rag_answer, agent_answer, main_answer



