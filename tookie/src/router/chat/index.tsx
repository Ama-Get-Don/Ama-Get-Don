import { RouteObject } from "react-router";
import { Chat } from "../../pages/chat";

const chatRoute: RouteObject = {
    path: 'chat',
    children: [
        {
            path: '',
            element: <Chat />
        }
    ]
}

export default chatRoute;