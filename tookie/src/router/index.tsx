import { createBrowserRouter, Outlet } from "react-router-dom";
import homeRoute from "./home";
import { LayoutComponent } from "../common";
import signUpRoute from "./signup";
import signInRoute from "./signin";

const router = createBrowserRouter([
    {
        path: '',
        element: (
            <LayoutComponent>
                <Outlet />
            </LayoutComponent>
        ),
        children: [homeRoute, signUpRoute, signInRoute]
    }
])

export default router;
