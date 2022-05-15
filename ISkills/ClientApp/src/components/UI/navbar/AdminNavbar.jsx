import {React, useState} from 'react';
import classes from "./Navbar.module.css";
import {Link, useLocation} from "react-router-dom";
import {adminRoutes} from "../../../router";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import {Tooltip} from "@material-ui/core";
import {IconButton} from "@mui/material";

const AdminNavbar = () => {
    const location = useLocation()
    const [modal, setModal] = useState(false)
    return (
        <div className={classes.adminNavbar__wrapper}>
            {!modal &&
                <Tooltip title="Show admin navbar" placement="right">
                    <IconButton aria-label="arrow" onClick={() => setModal(true)}>
                        <KeyboardDoubleArrowDownIcon sx={{transform: "rotate(270deg)"}}/>
                    </IconButton>
                </Tooltip>
            }
            {modal && <>
                <div className={classes.adminNavbar}>
                    <div className={classes.adminNavbar__links}>
                        {adminRoutes.map(route =>
                            <Link key={route.path} to={route.path}
                                  className={`${classes.navbar__link} ${location.pathname === route.path && classes.active}`}>{route.title}</Link>
                        )}
                    </div>
                </div>
                <Tooltip title="Hide admin navbar" placement="right">
                    <IconButton aria-label="arrow" onClick={() => setModal(false)}>
                        <KeyboardDoubleArrowDownIcon sx={{transform: "rotate(90deg)"}}/>
                    </IconButton>
                </Tooltip>
            </>
            }
        </div>
    );
};

export default AdminNavbar;