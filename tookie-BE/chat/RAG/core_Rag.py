from llama_index.core import SimpleDirectoryReader
from llama_index.core import VectorStoreIndex

from llama_index.llms.openai import OpenAI

from config.config import OPENAI_API_KEY
OpenAI.api_key = OPENAI_API_KEY
from llama_index.embeddings.openai import OpenAIEmbedding

from llama_index.core import StorageContext

import chromadb
from llama_index.vector_stores.chroma import ChromaVectorStore

# llm 모델 정보
llm = OpenAI(temperature=0.5, model="gpt-4")
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
query_engine = index.as_query_engine(llm=llm)

async def core_Rag(message):
    prompt = message
    message = f"User query:{prompt}"
    print(message)
    try:
        response = query_engine.query(message)
        print("RAG 결과:", response)
    except Exception as e:
        # 문서 검색이 실패할 경우 LLM의 사전 학습된 지식을 바탕으로 응답 생성
        print("문서 검색 실패:", e)
        response = llm.generate(message)

    return response