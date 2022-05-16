import React, {useEffect, useState} from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton} from '@mui/material'
import {useDispatch, useSelector} from "react-redux";
import {useFetching} from "../hooks/useFetching";
import CourseService from "../API/CourseService";

import {
    getCourses,
    removeCourse,
    setCourse,
    setCourses,
    setParams,
    setTotalCount,
    updateCourse, updateImage
} from "../store/CourseReducer";

import MyTable from "../components/UI/table/MyTable";
import MyPagination from "../components/UI/pagination/MyPagination";
import SortAndSearch from "../components/UI/sortAndSearch/SortAndSearch";
import {Link} from "react-router-dom";
import {adminRoutes} from "../router";
import AdminNavbar from "../components/UI/navbar/AdminNavbar";
import MyModal from "../components/UI/MyModal/MyModal";
import CourseForm from "../components/course/CourseForm";
import ImageUpload from "../components/UI/Upload/ImageUpload";
import MyButton from "../components/UI/button/MyButton";
import {Tooltip} from "@material-ui/core";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import defaultCourseImage from '../assets/images/defaultCourseImage.png'

const AdminCourses = () => {
    const courses = useSelector(state => state.course.courses)
    const params = useSelector(state => state.course.params)
    const sortList = useSelector(state => state.course.sortList)
    const totalCount = useSelector(state => state.course.totalCount)
    const isLoading = useSelector(state => state.course.isLoading)
    const error = useSelector(state => state.course.error)
    const dispatch = useDispatch()
    const [modal, setModal] = useState(false)
    const [imageModal, setImageModal] = useState(false)

    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    useEffect( () =>{
        dispatch(getCourses())
    }, [params.page, params.sortOption, params.themeId, params.reverse])

    return (
        <div style={{display: 'flex'}}>
            <AdminNavbar/>
                <div className="adminPage">
                    <h2 className="title">Courses</h2>
                    <SortAndSearch
                        params={params}
                        onParamsChange={value => dispatch(setParams(value))}
                        action={getCourses}
                        sortList={sortList}
                    />
                    <MyTable
                        items={courses}
                        remove={removeCourse}
                        updateClick={(course) => {
                            dispatch(setCourse(course))
                            setModal(true)
                        }}
                        iconChildren={ (url, course) =>
                            <Tooltip title={
                                <img src={url || defaultCourseImage} alt="image"/>
                            } placement="bottom">
                                <IconButton aria-label="update image" onClick={() => {
                                    dispatch(setCourse(course))
                                    setImageModal(true)
                                }}>
                                    <CameraAltOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                        }
                    />
                    <MyPagination page={params.page} pageSize={params.take} pageCount={courses.length}
                    totalCount={totalCount} changePage={changePage}/>
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
                        />
                    </MyModal>
                    }
                </div>
        </div>
    );
};
export default AdminCourses;