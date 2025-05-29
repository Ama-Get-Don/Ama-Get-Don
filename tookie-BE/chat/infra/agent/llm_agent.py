from chat.domain.agent.llm_agent import ILLMChain
from user.infra.db_models.models import InvestmentPreference

from llama_index.core import SimpleDirectoryReader
from llama_index.core import VectorStoreIndex
from config.config import OPENAI_API_KEY

from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core import StorageContext
import chromadb
from llama_index.vector_stores.chroma import ChromaVectorStore

from chat.infra.agent.prompt.system_prompt import create_divide_prompt, create_ask_prompt

from langchain_openai import ChatOpenAI

class LLMChain(ILLMChain):
    def __init__(self):
        self.divide_llm = ChatOpenAI(model="gpt-4", temperature=0.2, openai_api_key=OPENAI_API_KEY)
        self.ask_llm = ChatOpenAI(model="gpt-4o", temperature=0.7, openai_api_key=OPENAI_API_KEY)

    async def divide_chat(self, user_chat:str):
        divide_prompt = await create_divide_prompt(user_chat)
        response = await self.divide_llm.ainvoke(divide_prompt)
        return response.content.strip()


    async def run_rag(self, user_chat:str):
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

        retriever = index.as_retriever()
        relevant_nodes = retriever.retrieve(user_chat)  # message는 사용자 질문
        retrieved_docs = [node.get_text() for node in relevant_nodes]

        return retrieved_docs

    async def ask_chat(self, retrieved_docs:str, user_level:int,
                            user_investment_preferences:InvestmentPreference,
                            user_history:str, user_chat:str):
        ask_prompt = await create_ask_prompt(retrieved_docs, user_level,
                                   user_investment_preferences,
                                   user_history, user_chat)

        for token in self.ask_llm.stream(ask_prompt):
            yield token