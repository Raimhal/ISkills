import React from 'react';
import {Route, Routes} from "react-router-dom";
import {publicRoutes, privateRoutes, adminRoutes} from "../router";
import {useSelector} from "react-redux";
import NotFoundPage from "../pages/NotFoundPage";

const AppRouter = () => {
    const isAuth = useSelector(state => state.user.isAuth)
    const isAdmin = useSelector(state => state.user.isAdmin)

    let routes = [...publicRoutes]

    if(isAuth)
        routes = [...routes, ...privateRoutes]

    if(isAdmin)
        routes = [...routes, ...adminRoutes]

    routes.push({path: "*", component: <NotFoundPage/>})

    return (
            <Routes>
                {routes.map(route =>
                    <Route path={route.path} element={route.component}  key={route.path}/>
                )}
            </Routes>
    );
};

export default AppRouter;