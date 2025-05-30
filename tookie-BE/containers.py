from dependency_injector import containers, providers
from user.application.user_service import UserService
from user.infra.repository.user_repo import UserRepository, TokenRepository

from chat.application.chat_service import ChatService
from chat.infra.repository.chat_repo import ChatRepository, LimitRepository
from chat.infra.agent.llm_agent import LLMChain

class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(
        packages=["user", "chat"],
    )
    user_repo = providers.Factory(UserRepository)
    token_repo = providers.Factory(TokenRepository)
    user_service = providers.Factory(UserService, user_repo = user_repo, token_repo=token_repo)

    limit_repo = providers.Factory(LimitRepository)
    chat_repo = providers.Factory(ChatRepository)
    llm_chain = providers.Factory(LLMChain)
    chat_service = providers.Factory(ChatService, chat_repo = chat_repo, limit_repo=limit_repo, user_repo= user_repo, llm_chain=llm_chain)
