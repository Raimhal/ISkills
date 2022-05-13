import React from 'react';
import {Route, Routes} from "react-router-dom";
import {publicRoutes, privateRoutes, adminRoutes} from "../router";
import {useSelector} from "react-redux";

const AppRouter = () => {
    const isAuth = useSelector(state => state.user.isAuth)
    const isAdmin = useSelector(state => state.user.isAdmin)
    return (
            <Routes>
                {publicRoutes.map(route =>
                    <Route path={route.path} element={route.component} exact={route.exact} key={route.path}/>
                )}
                {isAuth && privateRoutes.map(route =>
                    <Route path={route.path} element={route.component} exact={route.exact} key={route.path}/>
                )}
                {isAdmin && adminRoutes.map(route =>
                    <Route path={route.path} element={route.component} exact={route.exact} key={route.path}/>
                )}
            </Routes>
    );
}

export default AppRouter;