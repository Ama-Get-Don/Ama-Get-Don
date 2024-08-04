import { RouteObject } from "react-router-dom";
import { Terms } from "../../pages/signup/Terms";
import { Info } from "../../pages/signup/Info";
import {Survey} from "../../pages/signup/Survey";
import { SignUpComplete } from "../../pages/signup/SignUpComplete";

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
        },
        {
            path: 'survey', 
            element: <Survey />
        },
        {
            path: 'complete', 
            element: <SignUpComplete />
        }
    ]
};

export default signUpRoute;
