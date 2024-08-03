import { createBrowserRouter, Outlet } from "react-router-dom";
import homeRoute from "./home";
import { LayoutComponent } from "../common";
import signUpRoute from "./signup";

const router = createBrowserRouter([
    {
        path: '',
        element: (
            <LayoutComponent>
                <Outlet />
            </LayoutComponent>
        ),
        children: [homeRoute, signUpRoute]
    }
])

export default router;
