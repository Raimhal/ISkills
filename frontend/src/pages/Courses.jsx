import React, {useEffect, useState} from 'react'
import "../styles/App.css"
import "../styles/Course.css"
import CourseList from "../components/course/CourseList";
import CourseService from "../API/CourseService";
import {useFetching} from "../hooks/useFetching";
import MyPagination from "../components/UI/pagination/MyPagination";
import {setCourses, setParams, setTotalCount} from "../store/CourseReducer";
import {useDispatch, useSelector} from "react-redux";
import SortAndSearch from "../components/UI/sortAndSearch/SortAndSearch";
import ThemeService from "../API/ThemeService";
import CategoryService from "../API/CategoryService";
import {setCategories} from "../store/CategoryReducer";
import {Menu, MenuItem, Typography} from "@material-ui/core";

import NestedMenuItem from "material-ui-nested-menu-item";
import MySelect from "../components/UI/select/MySelect";
import NestedMenu from "../components/UI/NestedMenu/NestedMenu";


const Courses = () => {
    const categories = useSelector(state => state.category.categories)

    const dispatch = useDispatch()
    const courses = useSelector(state => state.course.courses)
    const params = useSelector(state => state.course.params)
    const totalCount = useSelector(state => state.course.totalCount)
    const sortList = useSelector(state => state.course.sortList)
    const userId = useSelector(state => state.user.user.userId || state.user.user.id)
    const isAdmin = useSelector(state => state.user.isAdmin)

    const [getCourses, isCoursesLoading, coursesError] = useFetching(async () => {
        if(params.query === '')
            delete params.query
        const newParams = {
            ...params,
            skip: (params.page - 1) * params.take
        }
        const [totalCount, newCourses] = await CourseService.GetCourses({
            params: newParams
        })
        dispatch(setParams(newParams))
        dispatch(setCourses(newCourses))
        dispatch(setTotalCount(+totalCount))
    })

    const removeCourse = async (id) => {
        await CourseService.Delete(id)
        dispatch(setCourses(courses.filter(c => c.id !== id)))
        dispatch(setTotalCount(+totalCount - 1))
    }


    useEffect( () => {
        getCourses();
    }, [params.page, params.sortOption, params.themeId])



    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    return (
        <div className="wide main">
            <div>
            <SortAndSearch
                params={params}
                onParamsChange={value => dispatch(setParams(value))}
                action={getCourses}
                sortList={sortList}
            />
            </div>
            {!isCoursesLoading
                ?   <div>
                        <MyPagination page={params.page} pageSize={params.take} pageCount={courses.length}
                                      totalCount={totalCount} changePage={changePage}/>
                        <CourseList remove={removeCourse} courses={courses} userId={userId} isAdmin={isAdmin}/>
                        {coursesError && <div>{coursesError}</div>}
                        <MyPagination page={params.page} pageSize={params.take} pageCount={courses.length}
                                      totalCount={totalCount} changePage={changePage}/>
                    </div>
                : <div>Loading...</div>
            }
        </div>
    );
};

export default Courses;
