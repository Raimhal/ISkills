import React, {useEffect, useState} from 'react';
import {IconButton} from '@mui/material'
import {useDispatch, useSelector} from "react-redux";

import {
    clearError, clearLoading,
    getCourse,
    getCourses,
    removeCourse,
    setCourse,
    setParams,
    updateCourse,
    updateImage
} from "../store/CourseReducer";

import MyTable from "../components/UI/Table/MyTable";
import MyPagination from "../components/UI/Pagination/MyPagination";
import SortAndSearch from "../components/UI/SortAndSearch/SortAndSearch";
import AdminNavbar from "../components/UI/Navbar/AdminNavbar";
import MyModal from "../components/UI/MyModal/MyModal";
import CourseForm from "../components/course/CourseForm";
import ImageUpload from "../components/UI/Upload/ImageUpload";
import {Tooltip} from "@material-ui/core";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import defaultCourseImage from '../assets/images/defaultCourseImage.png'
import {getTheme} from "../store/ThemeReducer";
import {getAllCategories, getCategories} from "../store/CategoryReducer";
import ThemeService from "../API/ThemeService";
import {removeComment, setComment} from "../store/CommentReducer";
import EmptyList from "../components/UI/EmptyList/EmptyList";
import Loading from "../components/UI/Loading/Loading";

const AdminCourses = () => {
    const courses = useSelector(state => state.course.courses)
    const params = useSelector(state => state.course.params)
    const sortList = useSelector(state => state.course.sortList)
    const totalCount = useSelector(state => state.course.totalCount)
    const isLoading = useSelector(state => state.course.isLoading)
    const error = useSelector(state => state.course.error)
    const categories = useSelector(state => state.category.categories)
    const theme = useSelector(state => state.theme.theme)

    const dispatch = useDispatch()

    const [modal, setModal] = useState(false)
    const [imageModal, setImageModal] = useState(false)

    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    useEffect(() => {
        return () => {
            dispatch(clearLoading())
        }
    }, [])

    useEffect( () =>{
        dispatch(getCourses())
    }, [params.page, params.sortOption, params.themeId, params.reverse])

    return (
        <div className="wide main">
            <h3 className="title">Courses</h3>
            <SortAndSearch
                params={params}
                onParamsChange={value => dispatch(setParams(value))}
                action={getCourses}
                sortList={sortList}
                isLoading={isLoading}
            />
            {!isLoading ?
                <>
                {totalCount > 0
                    ?
                    <>
                        <MyTable
                            title="course"
                            items={courses}
                            remove={removeCourse}
                            updateClick={async (course) => {
                                dispatch(clearError())
                                const courseTheme = await ThemeService.GetTheme(course.themeId)
                                const category = categories.find(x => x.id === courseTheme.categoryId)
                                dispatch(setCourse({...course, categoryId: category.id}))
                                setModal(true)
                            }}
                            iconChildren={ (course) =>
                                <Tooltip title={
                                    <img src={course.imageUrl || defaultCourseImage} alt="image"/>
                                } placement="bottom">
                                    <IconButton aria-label="update image" onClick={() => {
                                        dispatch(setCourse(course))
                                        setImageModal(true)
                                    }}>
                                        <CameraAltOutlinedIcon />
                                    </IconButton>
                                </Tooltip>
                            }
                            clearError={() => dispatch(clearError())}
                            forbiddenFields={["id", "imageUrl"]}
                            error={error}
                        />
                        <MyPagination page={params.page} pageSize={params.take} pageCount={courses.length}
                                      totalCount={totalCount} changePage={changePage}/>
                    </>
                    : <EmptyList title="No courses found"/>
                }
                </>
                : <Loading/>
            }
            {modal &&
                <MyModal visible={modal} setVisible={setModal}>
                    <CourseForm action={() => {
                        dispatch(updateCourse(setModal))
                    }} title="Save"/>
                </MyModal>
            }
            {imageModal && <MyModal visible={imageModal} setVisible={setImageModal}>
                <ImageUpload
                    action={() => {
                        dispatch(updateImage(setImageModal))
                    }}
                    title="Update image"
                    submitTitle="Save"
                    setVisible={setImageModal}
                    isLoading={isLoading}
                    error={error}
                />
            </MyModal>
            }
        </div>
    );
};
export default AdminCourses;