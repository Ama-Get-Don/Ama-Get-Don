from llama_index.core import SimpleDirectoryReader
from llama_index.core import VectorStoreIndex
from llama_index.core.ingestion import IngestionPipeline
from llama_index.core.node_parser import TokenTextSplitter


from llama_index.core import Settings
from llama_index.llms.openai import OpenAI

from config.config import OPENAI_API_KEY
OpenAI.api_key = OPENAI_API_KEY
from llama_index.embeddings.openai import OpenAIEmbedding

from llama_index.core import StorageContext

import chromadb
from llama_index.vector_stores.chroma import ChromaVectorStore

from Chat.core_Chat import *

# llm 모델 정보
llm = OpenAI(temperature=0.2, model="gpt-4")
# 엠베딩 모델 정보
embed_model = OpenAIEmbedding()
# data 디렉터리에서 문서로드
documents = SimpleDirectoryReader("./data").load_data()

db = chromadb.PersistentClient(path="./new_chroma_db")
chroma_collection = db.get_or_create_collection("quickstart")

vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store = vector_store)

# 인덱스 생성
index = VectorStoreIndex.from_documents(documents, storage_context=storage_context, embed_model = embed_model)

# 쿼리엔진 생성
query_engine = index.as_query_engine(llm=llm)

def core_Rag(message):

    # 이전 대화 요약
    history_summary = summarize_history()
    print(history_summary)
    # 요약된 대화 맥락과 현재 메시지를 결합한 쿼리 작성
    combined_message = f"Preveous summary: {history_summary}\nUser query:{message}"


    response = query_engine.query(combined_message)

    return response

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