import { RouteObject } from "react-router-dom";
import { SignIn } from "../../pages/signup";

const signInRoute: RouteObject = {
    path: 'sign-in',
    children: [
        {
            path: '',
            element: <SignIn />
        }
    ]
};

export default signInRoute;