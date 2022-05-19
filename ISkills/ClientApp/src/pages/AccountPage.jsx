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
import {colorTheme} from "../components/UI/Themes";
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

const AccountPage = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const isLoading = useSelector(state => state.user.isLoading)
    const error = useSelector(state => state.user.error)
    const [modal, setModal] = useState(false)
    const [value, setValue] = useState("member")
    const params = useSelector(state => state.course.params)
    const sortList = useSelector(state => state.course.sortList)
    const courses = useSelector(state => state.course.courses)
    const totalCount = useSelector(state => state.course.totalCount)
    const isAdmin = useSelector(state => state.user.isAdmin)

    useEffect(() => {
        dispatch(getCurrentUser())

        return () => {
            dispatch(clearCourses())
        }
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
    }, [params.page, params.sortOption, params.themeId, params.reverse])

    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    return (
        <div className="wide main account">
            {!isLoading &&
                <div className="top">
                    <div className="look-up">
                        <div style={{position: "relative"}}>
                            <Tooltip title="Update image" placement="bottom">
                            <img
                                src={ user.imageUrl || defaultUserImage}
                                alt="current user image"
                                className='user__image'
                                onClick={() => setModal(true)}
                            />
                            </Tooltip>
                        </div>
                        {modal && <MyModal visible={modal} setVisible={setModal}>
                            <ImageUpload
                                action={() => {
                                    dispatch(updateImage())
                                    setModal(false)
                                }}
                                title="Update image"
                                submitTitle="Save"
                                setVisible={setModal}
                                isLoading={isLoading}
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
            }
            <SortAndSearch
                params={params}
                onParamsChange={value => dispatch(setParams(value))}
                action={getCourses}
                sortList={sortList}
            />
            <ThemeProvider theme={colorTheme}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="primary"
                    indicatorColor="primary"
                    aria-label="primary course tabs"
                >
                    <Tab value="member" label="Member courses" onClick={
                        () => dispatch(getMemberCourses())
                    }/>
                    <Tab value="my" label="My courses" onClick={
                        () => dispatch(getCourses(user.id))
                    }/>
                </Tabs>
            </ThemeProvider>
            <div>
                <MyPagination page={params.page} pageSize={params.take} pageCount={courses.length}
                              totalCount={totalCount} changePage={changePage}/>
                <CourseList remove={removeCourse} courses={courses} userId={user.id} isAdmin={isAdmin}/>
                {/*{coursesError && <div>{coursesError}</div>}*/}
                <MyPagination page={params.page} pageSize={params.take} pageCount={courses.length}
                              totalCount={totalCount} changePage={changePage}/>
            </div>
        </div>
    );
};

export default AccountPage;