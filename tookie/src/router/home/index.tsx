import { RouteObject } from "react-router-dom";
import { HomePage } from "../../pages/home";

const homeRoute: RouteObject = {
    path: 'home',
    element: <HomePage/>,
};

export default homeRoute;