import { RouteObject } from "react-router-dom";
import { Terms } from "../../pages/signup/Terms";
import { Info } from "../../pages/signup/Info";
import {KnowledgeLevelSurvey} from "../../pages/signup/KnowledgeLevelSurvey";
import {InvestmentProfileSurvey} from "../../pages/signup/InvestmentProfileSurvey";
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
            path: 'knowledge_level_survey', 
            element: <KnowledgeLevelSurvey />
        },
        {
            path: 'investment_profile_survey', 
            element: <InvestmentProfileSurvey />
        },
        {
            path: 'complete', 
            element: <SignUpComplete />
        }
    ]
};

export default signUpRoute;
