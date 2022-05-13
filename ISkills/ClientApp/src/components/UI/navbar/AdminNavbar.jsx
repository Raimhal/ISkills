import React from 'react';
import classes from "./Navbar.module.css";
import {Link, useLocation} from "react-router-dom";
import {adminRoutes} from "../../../router";

const AdminNavbar = () => {
    const location = useLocation()
    return (
        <div className={classes.adminNavbar}>

            <div className={classes.adminNavbar__links}>
                {adminRoutes.map(route =>
                    <Link key={route.path} to={route.path} className={`${classes.navbar__link} ${location.pathname === route.path && classes.active}`}>{route.title}</Link>
                )}
            </div>
        </div>
    );
};

export default AdminNavbar;