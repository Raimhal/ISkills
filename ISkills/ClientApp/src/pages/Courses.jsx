import React, {useEffect} from 'react'
import "../styles/App.css"
import "../styles/Course.css"
import CourseList from "../components/course/CourseList";
import MyPagination from "../components/UI/Pagination/MyPagination";
import {clearCourse, clearCourses, getCourses, removeCourse, setParams} from "../store/CourseReducer";
import {useDispatch, useSelector} from "react-redux";
import SortAndSearch from "../components/UI/SortAndSearch/SortAndSearch";


const Courses = () => {
    const categories = useSelector(state => state.category.categories)

    const dispatch = useDispatch()
    const courses = useSelector(state => state.course.courses)
    const params = useSelector(state => state.course.params)
    const totalCount = useSelector(state => state.course.totalCount)
    const sortList = useSelector(state => state.course.sortList)
    const userId = useSelector(state => state.user.user.userId || state.user.user.id)
    const isAdmin = useSelector(state => state.user.isAdmin)
    const theme = useSelector(state => state.theme.theme)
    const coursesError = useSelector(state => state.course.error)
    const isCoursesLoading = useSelector(state => state.course.isLoading)


    useEffect( () => {
        dispatch(getCourses());

        return () => {
            dispatch(clearCourses())
        }
    }, [params.page, params.sortOption, params.themeId, params.reverse])



    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    return (
        <div className="wide main">
            <div style={{display: "flex", flexDirection: "column"}} >
                <SortAndSearch
                    params={params}
                    onParamsChange={value => dispatch(setParams(value))}
                    action={getCourses}
                    sortList={sortList}
                />
                {params.themeId
                && <div>
                    Theme: {theme?.title}
                </div>
                }
            </div>
            <div>
                <MyPagination page={params.page} pageSize={params.take} pageCount={courses.length}
                              totalCount={totalCount} changePage={changePage}/>
                <CourseList remove={removeCourse} courses={courses} userId={userId} isAdmin={isAdmin}/>
                {coursesError && <div>{coursesError}</div>}
                <MyPagination page={params.page} pageSize={params.take} pageCount={courses.length}
                                  totalCount={totalCount} changePage={changePage}/>
            </div>
        </div>
    );
};

export default Courses;
