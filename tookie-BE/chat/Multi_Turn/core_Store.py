from llama_index.core.memory import ChatSummaryMemoryBuffer
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.llms.openai import OpenAI as OpenAiLlm
import tiktoken


# 대화정보 요약하는 LLM
model = "gpt-4-0125-preview"
summarizer_llm = OpenAiLlm(model_name=model, max_tokens=256) # 요약해서 생성하는 토큰의 수는 256이 최대이다.
tokenizer_fn = tiktoken.encoding_for_model(model).encode

memory = ChatSummaryMemoryBuffer.from_defaults(
    llm=summarizer_llm,
    token_limit=1024,  # 메모리에 토큰이 1024넘어가면 요약함
    tokenizer_fn=tokenizer_fn,
)

def add_message_to_memory(role, content):
    message = ChatMessage(role=role, content=content)
    memory.put(message)

def summarize_history():
    history = memory.get()
    return " ".join([msg.content for msg in history])

def core_Store(question, answer):
    add_message_to_memory(MessageRole.USER, question)
    add_message_to_memory(MessageRole.ASSISTANT, answer)

