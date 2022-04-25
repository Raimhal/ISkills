import React from 'react';
import {Link} from "react-router-dom";
import classes from "./Navbar.module.css"
import {useDispatch, useSelector} from "react-redux";
import {logoutUser} from "../../../store/UserReducer";
const Navbar = () => {
    const isAuth = useSelector(state => state.user.isAuth)
    const dispatch = useDispatch()
    return (
        <div className={classes.navbar}>
            <div>
                <Link to="/courses" className={classes.navbar__link}>ISkills</Link>
            </div>
            <div>
                {isAuth
                    ? <div className={classes.navbar__links}>
                        <Link to="/courses" className={classes.navbar__link}>Courses</Link>
                        <Link to="/account" className={classes.navbar__link}>Account</Link>
                        <Link to="/login" className={classes.navbar__link} onClick={() => {
                            dispatch(logoutUser())
                            localStorage.clear()
                        }
                        }>Logout</Link>
                    </div>
                    : <div className={classes.navbar__links}>
                        <Link to="/courses" className={classes.navbar__link}>Courses</Link>
                        <Link to="/login" className={classes.navbar__link}>Log in</Link>
                        <Link to="/register" className={classes.navbar__link}>Register</Link>
                    </div>
                }
            </div>
        </div>
    );
};

export default Navbar;