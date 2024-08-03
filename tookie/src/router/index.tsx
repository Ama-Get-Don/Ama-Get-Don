import { createBrowserRouter, Outlet } from "react-router-dom";
import homeRoute from "./home";
import { LayoutComponent } from "../common";

const router = createBrowserRouter([
    {
        path:'',
        element: (
            <LayoutComponent>
               <Outlet/>
            </LayoutComponent>
        ),
        children: [homeRoute]
    }
])

export default router;