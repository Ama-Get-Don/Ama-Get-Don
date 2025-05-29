from llama_index.core.memory import ChatSummaryMemoryBuffer
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.llms.openai import OpenAI as OpenAiLlm
import tiktoken

user_memory_dict = {}

# 대화정보 요약하는 LLM
model = "gpt-4-0125-preview"
summarizer_llm = OpenAiLlm(model_name=model, max_tokens=256) # 요약해서 생성하는 토큰의 수는 256이 최대이다.
tokenizer_fn = tiktoken.encoding_for_model(model).encode

def get_user_memory(user_id: str):
    print(user_memory_dict)
    if user_id not in user_memory_dict:
        user_memory_dict[user_id] = ChatSummaryMemoryBuffer.from_defaults(
            llm=summarizer_llm,
            token_limit=1024,
            tokenizer_fn=tokenizer_fn,
        )
    return user_memory_dict[user_id]

def add_message_to_memory(user_id:str, role, content):
    memory = get_user_memory(user_id)
    message = ChatMessage(role=role, content=content)
    memory.put(message)

def summarize_history(user_id:str):
    memory = get_user_memory(user_id)
    history = memory.get()
    return " ".join([msg.content for msg in history])

def core_Store(user_id:str, question:str, answer:str):
    add_message_to_memory(user_id, MessageRole.USER, question)
    add_message_to_memory(user_id, MessageRole.ASSISTANT, answer)

