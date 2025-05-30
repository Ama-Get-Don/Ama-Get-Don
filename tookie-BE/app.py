from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from user.interface.controllers import user_controller
from chat.interface.controllers import chat_controller
from containers import Container

app = FastAPI()
container = Container()
container.wire(modules=[user_controller, chat_controller])

app.container = container

origins = [
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_controller.router)
app.include_router(chat_controller.router)
