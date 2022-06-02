import React, {useEffect, useState} from 'react';
import defaultUserImage from '../assets/images/defaultUserImage.png'
import UserForm from "../components/user/UserForm";
import MyRating from "../components/UI/Rating/MyRating";
import {useDispatch, useSelector} from "react-redux";
import {getCurrentUser, updateImage, updateUser} from "../store/UserReducer";
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

const AccountPage = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const isLoading = useSelector(state => state.user.isActionLoading)
    const isImageLoading = useSelector(state => state.user.isImageLoading)
    const error = useSelector(state => state.user.error)
    const [modal, setModal] = useState(false)
    const [value, setValue] = useState("member")
    const params = useSelector(state => state.course.params)
    const sortList = useSelector(state => state.course.sortList)
    const courses = useSelector(state => state.course.courses)
    const totalCount = useSelector(state => state.course.totalCount)
    const isAdmin = useSelector(state => state.user.isAdmin)
    const isCoursesLoading = useSelector(state => state.course.isLoading)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if(isAdmin)
            setValue("my")

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
                                        onClick={() => setModal(true)}
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
                            <MyRating value={user.rating} readonly/>
                        </div>
                        <div>
                            <UserForm action={() => {
                                dispatch(updateUser())
                            }} submitTitle="Save"/>
                        </div>
                    </div>
                    <ThemeProvider theme={colorTheme}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            textColor="primary"
                            indicatorColor="primary"
                            aria-label="primary course tabs"
                        >
                            {!isAdmin && <Tab value="member" label="Member courses"/>}
                            <Tab value="my" label={!isAdmin ? "My courses" : "Courses"}/>
                        </Tabs>
                    </ThemeProvider>
                    <SortAndSearch
                        params={params}
                        onParamsChange={value => dispatch(setParams(value))}
                        action={getCourses}
                        sortList={sortList}
                    />
                    {!isCoursesLoading && courses.length > 0 ?
                        <div>
                            <MyPagination page={params.page} pageSize={params.take} pageCount={courses.length}
                                          totalCount={totalCount} changePage={changePage}/>
                            <CourseList remove={removeCourse} courses={courses} userId={user.id} isAdmin={isAdmin}/>
                            <MyPagination page={params.page} pageSize={params.take} pageCount={courses.length}
                                          totalCount={totalCount} changePage={changePage}/>
                        </div>
                        :   <div style={{position: "relative"}}>
                                <Loading/>
                            </div>
                    }
                </div>
    );
};

export default AccountPage;