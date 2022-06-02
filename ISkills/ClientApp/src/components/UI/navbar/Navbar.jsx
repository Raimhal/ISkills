import React, {useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import classes from "./Navbar.module.css"
import {useDispatch, useSelector} from "react-redux";
import {logoutUser} from "../../../store/UserReducer";
import MyModal from "../MyModal/MyModal";
import CourseForm from "../../course/CourseForm";
import {clearParams, createCourse, getCourses} from "../../../store/CourseReducer";
import NestedMenu from "../NestedMenu/NestedMenu";
import {Fab, IconButton} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {ThemeProvider} from "@emotion/react";
import {Tooltip} from "@material-ui/core";
import AdminMenu from "../NestedMenu/AdminMenu";
import {colorTheme} from "../../../styleThemes";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

const Navbar = () => {
    const isAuth = useSelector(state => state.user.isAuth)
    const isAdmin = useSelector(state => state.user.isAdmin)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [burgerModal, setBurgerModal] = useState(false)

    const isCreateCourse = new RegExp(/^\/courses\/([\w\d-]+)/).test(location.pathname)

    const [modal, setModal] = useState(false)
    return (
        <div className={classes.navbar}>
            <div>
                <Link to="/" onClick={() => {
                    dispatch(clearParams())
                    dispatch(getCourses())
                }} className={classes.navbar__link}>ISkills</Link>
                {isAuth && !isCreateCourse && <ThemeProvider theme={colorTheme}>
                    <Tooltip title="Create course">
                        <Fab
                            color="primary"
                            aria-label="add"
                            size="small"
                            onClick={() => setModal(true)}
                            className={classes.navbar__link}
                        >
                            <AddIcon/>
                        </Fab>
                    </Tooltip>
                </ThemeProvider>
                }
                {modal && <MyModal visible={modal} setVisible={setModal}>
                    <CourseForm action={async () => {
                        await dispatch(createCourse(setModal, navigate))
                    }} title="Create"/>
                </MyModal>
                }
                <NestedMenu label="Categories" className={classes.navbar__link}/>
            </div>
                <div>
                {isAdmin &&
                <AdminMenu label='Admin' className={classes.navbar__link}/>
                }
                <IconButton aria-label="add file type" onClick={() => setBurgerModal(true)}>
                    <MenuRoundedIcon className={classes.navbar__link}/>
                </IconButton>
                {burgerModal && <MyModal
                    visible={burgerModal}
                    setVisible={setBurgerModal}
                    style={{justifyContent: "end", minHeight: "100vh"}}
                    childrenStyle={{minHeight: "100vh", backgroundColor: "rgba(0, 0, 0, 0.8)", minWidth: "150px"}}
                >
                    {isAuth
                        ? <div className={classes.navbar__links}>
                            <Link to="/"
                                  className={`${classes.navbar__link} ${location.pathname === "/" && classes.active}`}
                                  onClick={() => setBurgerModal(false)}
                            >
                                Courses
                            </Link>
                            <Link to="/account"
                                  className={`${classes.navbar__link} ${location.pathname === "/account" && classes.active}`}
                                  onClick={() => setBurgerModal(false)}
                            >
                                Account
                            </Link>
                            <Link to="/login"
                                  className={`${classes.navbar__link} ${location.pathname === "/register" && classes.active}`}
                                  onClick={() => {
                                      setBurgerModal(false)
                                      dispatch(logoutUser())
                                      localStorage.clear()
                                  }
                                  }
                            >
                                Log out
                            </Link>
                        </div>
                        : <div className={classes.navbar__links}>
                            <Link to="/"
                                  className={`${classes.navbar__link} ${location.pathname === "/" && classes.active}`}
                                  onClick={() => setBurgerModal(false)}
                            >
                                Courses
                            </Link>
                            <Link to="/login"
                                  className={`${classes.navbar__link} ${location.pathname === "/login" && classes.active}`}
                                  onClick={() => setBurgerModal(false)}
                            >
                                Log in
                            </Link>
                            <Link to="/register"
                                  className={`${classes.navbar__link} ${location.pathname === "/register" && classes.active}`}
                                  onClick={() => setBurgerModal(false)}
                            >
                                Sing up
                            </Link>
                        </div>
                    }
                </MyModal>
                }
                </div>
        </div>
    );
};

export default Navbar;