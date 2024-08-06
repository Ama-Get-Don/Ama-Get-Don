from llama_index.core import SimpleDirectoryReader
from llama_index.core import VectorStoreIndex

from llama_index.llms.openai import OpenAI

from config.config import OPENAI_API_KEY
OpenAI.api_key = OPENAI_API_KEY
from llama_index.embeddings.openai import OpenAIEmbedding

from llama_index.core import StorageContext

import chromadb
from llama_index.vector_stores.chroma import ChromaVectorStore

from chat.Multi_Turn.core_Chat import *

# llm 모델 정보
llm = OpenAI(temperature=0.8, model="gpt-4o")
# 엠베딩 모델 정보
embed_model = OpenAIEmbedding()
# data 디렉터리에서 문서로드
documents = SimpleDirectoryReader("./data").load_data()

db = chromadb.PersistentClient(path="new_chroma_db")
chroma_collection = db.get_or_create_collection("quickstart")

vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store = vector_store)

# 인덱스 생성
index = VectorStoreIndex.from_documents(documents, storage_context=storage_context, embed_model = embed_model)

# 쿼리엔진 생성
query_engine = index.as_query_engine(streaming=True, llm=llm) # 스트리밍으로 반환하도록 설정

async def core_Rag(message, user_info):

    # 이전 대화 요약
    history_summary = summarize_history()
    print(history_summary)

    # 사용자 수준 별 다른 프롬프트 제공 (사용자에 대한 정보를 반영하여 맞춤형 답변을 준다)
    '''
    if user_info["level"] == 1:
        prompt = seed(message, user_info)
    elif user_info["level"] == 2:
        prompt = sprout(message, user_info)
    elif user_info["level"] == 3:
        prompt = tooki(message, user_info)
    '''
    prompt = message
    # 요약된 대화 맥락과 현재 프롬프트를 결합한 쿼리 작성
    print("현재 맥락", history_summary)
    combined_message = f"Preveous summary: {history_summary}\nUser query:{prompt}"

    print(combined_message)

    try:
        streaming_response = query_engine.query(combined_message)
        print("현재 뽑히고 있는:")
        for text in streaming_response.response_gen:
            yield text
    except Exception as e:
        # 문서 검색이 실패할 경우 LLM의 사전 학습된 지식을 바탕으로 응답 생성
        print("문서 검색 실패:", e)
        fallback_response = llm.generate(combined_message)
        yield fallback_response



'''
# 문서를 노드 단위로 분할
pipeline = IngestionPipeline(transformations=[TokenTextSplitter(), ...])
nodes = pipeline.run(documents=documents)

# 메타 데이터 추가
document = Document(
    text="text",
    metadata={"filename": "<doc_file_name>", "category": "<category>"},
)
'''