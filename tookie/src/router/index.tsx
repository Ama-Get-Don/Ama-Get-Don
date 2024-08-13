import { createBrowserRouter, Outlet } from "react-router-dom";
import homeRoute from "./home";
import { LayoutComponent } from "../common";
import signUpRoute from "./signup";
import signInRoute from "./signin";
import chatRoute from "./chat";

const router = createBrowserRouter([
    {
        path: '',
        element: (
            <LayoutComponent>
                <Outlet />
            </LayoutComponent>
        ),
        children: [homeRoute, signUpRoute, signInRoute, chatRoute]
    }
])

export default router;
