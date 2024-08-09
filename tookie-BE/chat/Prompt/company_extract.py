# 키워드 추출하는 프롬프트
from langchain_core.prompts import ChatPromptTemplate
async def company_extract(text):
    return ChatPromptTemplate.from_template(f'''너는 [사용자의 질문] 에서 투자하고자 하는 회사를 추출하는 추출기야.
        답변을 줄때 [데이터 형식]대로 결과를 반환 해줘! 
        다른 필요없는 텍스트 붙이지 말고 오직 리스트만 반환해야해!

        [사용자의 질문]    
        {text}

        [데이터 형식]
        반드시 ex1>과 ex2> 처럼 회사를 추출해서 리스트 형태로 결과를 반환해줘!(군더더기 말 붙이지 말고 리스트만 반환해야해!)
        ex1>
        ["NVIDIA", "삼성전자", "구글"]
        ex2>
        ["마이크로소프트", "LG전자", "셀트리온"]''')