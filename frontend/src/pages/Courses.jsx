import React, {useEffect, useState} from 'react'
import "../styles/App.css"
import "../styles/Course.css"
import CourseList from "../components/course/CourseList";
import MyButton from "../components/UI/button/MyButton";
import CourseForm from "../components/course/CourseForm";
import MyModal from "../components/UI/MyModal/MyModal";
import CourseService from "../API/CourseService";
import {useFetching} from "../hooks/useFetching";
import MyPagination from "../components/UI/pagination/MyPagination";
import MySelect from "../components/UI/select/MySelect";
import {setCourse, setCourses, setParams, setTotalCount} from "../store/CourseReducer";
import MyInput from "../components/UI/input/MyInput";
import {useDispatch, useSelector} from "react-redux";
import SortAndSearch from "../components/UI/sortAndSearch/SortAndSearch";


const Courses = () => {

    const dispatch = useDispatch()
    const courses = useSelector(state => state.course.courses)
    const params = useSelector(state => state.course.params)
    const totalCount = useSelector(state => state.course.totalCount)
    const sortList = useSelector(state => state.course.sortList)
    const userId = useSelector(state => state.user.user.userId)
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

    const createCourse = async (course) => {
        const courseId = await CourseService.Create(course)
        dispatch(setCourses([...courses, {...course, id: courseId, rating: 0, creatorId: userId}]))
        setModal(false)
        dispatch(setTotalCount(+totalCount + 1))
    }

    const removeCourse = async (id) => {
        await CourseService.Delete(id)
        dispatch(setCourses(courses.filter(c => c.id !== id)))
        dispatch(setTotalCount(+totalCount - 1))
    }



    useEffect( () => {
        getCourses();
    }, [params.page])

    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }


    const [modal, setModal] = useState(false)

    return (
        <div>
            {!isCoursesLoading
                ? <div className="wide main">
                    <SortAndSearch
                        params={params}
                        onParamsChange={value => dispatch(setParams(value))}
                        action={getCourses}
                        sortList={sortList}
                    />
                    <MyButton onClick={() => setModal(true)}>Add course</MyButton>
                    {modal && <MyModal visible={modal} setVisible={setModal}>
                        <CourseForm action={createCourse} title="Create"/>
                    </MyModal>
                    }
                    <div>
                        <MyPagination page={params.page} pageSize={params.take} pageCount={courses.length}
                                      totalCount={totalCount} changePage={changePage}/>
                            <CourseList remove={removeCourse} courses={courses} userId={userId} isAdmin={isAdmin}/>
                        {coursesError && <div>{coursesError}</div>}
                        <MyPagination page={params.page} pageSize={params.take} pageCount={courses.length}
                                      totalCount={totalCount} changePage={changePage}/>
                    </div>
                </div>
                : <div>Loading...</div>
            }
        </div>
    );
};

export default Courses;
