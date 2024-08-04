import { RouteObject } from "react-router-dom";
import { Terms } from "../../pages/signup/Terms";
import { Info } from "../../pages/signup/Info";

const signUpRoute: RouteObject = {
    path: 'sign-up',
    children: [
        {
            path: 'terms',
            element: <Terms />
        },
        {
            path: 'info',
            element: <Info />
        }
    ]
};

export default signUpRoute;
