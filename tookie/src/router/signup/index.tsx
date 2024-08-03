import { RouteObject } from "react-router-dom";
import { SignUp } from "../../pages/signup";

const signUpRoute: RouteObject = {
    path: 'sign-up',
    element: <SignUp />
};

export default signUpRoute;
