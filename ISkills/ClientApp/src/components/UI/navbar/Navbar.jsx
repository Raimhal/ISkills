import React, {useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import classes from "./Navbar.module.css"
import {useDispatch, useSelector} from "react-redux";
import {logoutUser} from "../../../store/UserReducer";
import MyButton from "../button/MyButton";
import MyModal from "../MyModal/MyModal";
import CourseForm from "../../course/CourseForm";
import CourseService from "../../../API/CourseService";
import {clearParams, getCourses, setCourses, setTotalCount} from "../../../store/CourseReducer";
import NestedMenu from "../NestedMenu/NestedMenu";
import {Fab} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {colorTheme} from "../themes";
import {ThemeProvider} from "@emotion/react";
import {Tooltip} from "@material-ui/core";
import AdminMenu from "../NestedMenu/AdminMenu";
const Navbar = () => {
    const isAuth = useSelector(state => state.user.isAuth)
    const isAdmin = useSelector(state => state.user.isAdmin)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const isCreateCourse = new RegExp(/^\/courses\/([\w\d-]+)/).test(location.pathname)
    // const userId = useState(state => state.user?.user?.userId)
    const courses = useSelector(state => state.course.courses)
    const totalCount = useSelector(state => state.course.totalCount)

    const createCourse = async (course) => {
        const courseId = await CourseService.Create(course)
        dispatch(setCourses([...courses, {...course, id: courseId, rating: 0}]))
        setModal(false)
        dispatch(setTotalCount(+totalCount + 1))
        navigate(`/courses/${courseId}`)
    }

    const [modal, setModal] = useState(false)
    return (
        <div className={classes.navbar}>
            <div>
                <Link to="/courses" onClick={() => {
                    dispatch(clearParams())
                    dispatch(getCourses())
                }} className={classes.navbar__link}>ISkills</Link>
                {isAuth && !isCreateCourse && <ThemeProvider theme={colorTheme}>
                    <Tooltip title="Create course">
                        <Fab color="primary" aria-label="add" size="small" onClick={() => setModal(true)}
                             className={classes.navbar__link}>
                            <AddIcon/>
                        </Fab>
                    </Tooltip>
                </ThemeProvider>
                }
                {modal && <MyModal visible={modal} setVisible={setModal}>
                    <CourseForm action={createCourse} title="Create"/>
                </MyModal>
                }
                <NestedMenu label="Categories" className={classes.navbar__link}/>
            </div>
            <div>
                {isAuth
                    ? <div className={classes.navbar__links}>
                        {isAdmin &&
                            <AdminMenu label='Admin' className={classes.navbar__link}/>
                        }
                        <Link to="/courses" className={`${classes.navbar__link} ${location.pathname === "/courses" && classes.active}`}>Courses</Link>
                        <Link to="/account" className={`${classes.navbar__link} ${location.pathname === "/account" && classes.active}`}>Account</Link>
                        <Link to="/login" className={`${classes.navbar__link} ${location.pathname === "/register" && classes.active}`} onClick={() => {
                            dispatch(logoutUser())
                            localStorage.clear()
                        }
                        }>Log out</Link>
                    </div>
                    : <div className={classes.navbar__links}>
                        <Link to="/courses" className={`${classes.navbar__link} ${location.pathname === "/courses" && classes.active}`}>Courses</Link>
                        <Link to="/login" className={`${classes.navbar__link} ${location.pathname === "/login"&& classes.active}`}>Log in</Link>
                        <Link to="/register" className={`${classes.navbar__link} ${location.pathname === "/register" && classes.active}`}>Sing up</Link>
                    </div>
                }
            </div>
        </div>
    );
};

export default Navbar;