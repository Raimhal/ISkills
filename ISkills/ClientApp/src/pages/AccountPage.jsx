import React, {useEffect, useState} from 'react';
import defaultUserImage from '../assets/images/defaultUserImage.png'
import UserForm from "../components/user/UserForm";
import MyRating from "../components/UI/Rating/MyRating";
import {useDispatch, useSelector} from "react-redux";
import {clearError, clearUser, getCurrentUser, updateImage, updateUser} from "../store/UserReducer";
import MyModal from "../components/UI/MyModal/MyModal";
import ImageUpload from "../components/UI/Upload/ImageUpload";
import {Tooltip} from "@material-ui/core";
import UserService from "../API/UserService";
import {Tab, Tabs, ThemeProvider} from "@mui/material";
import SortAndSearch from "../components/UI/SortAndSearch/SortAndSearch";
import {
    clearCourses,
    getCourses,
    getMemberCourses,
    getMyCourses,
    removeCourse,
    setParams
} from "../store/CourseReducer";
import MyPagination from "../components/UI/Pagination/MyPagination";
import CourseList from "../components/course/CourseList";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import {colorTheme} from "../styleThemes";
import Loading from "../components/UI/Loading/Loading";
import {clearTheme} from "../store/ThemeReducer";
import EmptyList from "../components/UI/EmptyList/EmptyList";

const AccountPage = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const isLoading = useSelector(state => state.user.isActionLoading)
    const isImageLoading = useSelector(state => state.user.isImageLoading)
    const error = useSelector(state => state.user.error)
    const isAdmin = useSelector(state => state.user.isAdmin)

    const [modal, setModal] = useState(false)
    const [value, setValue] = useState(isAdmin ? "my" : "member")

    const params = useSelector(state => state.course.params)
    const sortList = useSelector(state => state.course.sortList)
    const courses = useSelector(state => state.course.courses)
    const totalCount = useSelector(state => state.course.totalCount)
    const isCoursesLoading = useSelector(state => state.course.isLoading)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        dispatch(clearTheme())
    }, [])

    useEffect(() => {

        switch (value) {
            case "member":
                dispatch(getMemberCourses())
                break;
            case "my":
                dispatch(getCourses(user.id))
                break;
        }

        return () => {
            dispatch(clearCourses())
        }
    }, [params.page, params.sortOption, params.themeId, params.reverse, value])

    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    return (
        <div className="wide main account">
                    <div className="top">
                        <div className="look-up">
                            <div style={{position: "relative"}}>
                                <Tooltip title="Update image" placement="bottom">
                                    <img
                                        src={user.imageUrl || defaultUserImage}
                                        alt="current user image"
                                        className='user__image'
                                        onClick={() => {
                                            dispatch(clearError())
                                            setModal(true)
                                        }}
                                    />
                                </Tooltip>
                            </div>
                            {modal && <MyModal visible={modal} setVisible={setModal}>
                                <ImageUpload
                                    action={() => {
                                        dispatch(updateImage(setModal))
                                    }}
                                    title="Update image"
                                    submitTitle="Save"
                                    setVisible={setModal}
                                    isLoading={isImageLoading}
                                    error={error}
                                />
                            </MyModal>
                            }
                            {user.rating > 0 && <MyRating value={user.rating} readonly/>}
                        </div>
                        <div>
                            <UserForm action={() => {
                                dispatch(updateUser())
                            }} submitTitle="Save"/>
                        </div>
                    </div>
                    <ThemeProvider theme={colorTheme}>
                        {value !== "" &&
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                textColor="primary"
                                indicatorColor="primary"
                                aria-label="primary course tabs"
                            >
                                {!isAdmin && <Tab value="member" label="Member courses"/>}
                                <Tab value="my" label="My courses" />
                            </Tabs>
                        }
                    </ThemeProvider>
                    <SortAndSearch
                        params={params}
                        onParamsChange={value => dispatch(setParams(value))}
                        action={getCourses}
                        sortList={sortList}
                        isLoading={isCoursesLoading}
                    />
                    {!isCoursesLoading ?
                        <>
                            {totalCount > 0 ?
                                <div>
                                    <MyPagination page={params.page} pageSize={params.take} pageCount={courses.length}
                                                  totalCount={totalCount} changePage={changePage}/>
                                    <CourseList remove={removeCourse} courses={courses} userId={user.id} isAdmin={isAdmin}/>
                                    <MyPagination page={params.page} pageSize={params.take} pageCount={courses.length}
                                                  totalCount={totalCount} changePage={changePage}/>
                                </div>
                                :
                                <EmptyList title="No courses found"/>
                            }
                        </>
                        :   <div style={{position: "relative"}}>
                                <Loading/>
                            </div>
                    }
                </div>
    );
};

export default AccountPage;