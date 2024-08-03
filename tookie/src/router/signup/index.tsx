import { RouteObject } from "react-router-dom";
import { Terms } from "../../pages/signup/Terms";

const signUpRoute: RouteObject = {
    path: 'sign-up',
    children: [
        {
            path: 'terms',
            element: <Terms />
        }
    ]
};

export default signUpRoute;
