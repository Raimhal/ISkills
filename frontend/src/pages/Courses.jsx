import React, {useEffect, useState} from 'react'
import "../styles/App.css"
import "../styles/Course.css"
import CourseList from "../components/CourseList";
import MyButton from "../components/UI/button/MyButton";
import CourseForm from "../components/CourseForm";
import MyModal from "../components/UI/MyModal/MyModal";
import CourseService from "../API/CourseService";
import {useFetching} from "../hooks/useFetching";
import MyPagination from "../components/UI/pagination/MyPagination";

const Courses = () => {
    const [courses, setCourses] = useState([])
    const initialParamsState = {
        skip: 0,
        take: 10,
        reverse: true,
        sortOption: 'rating'
    }

    const [params, setParams] = useState(initialParamsState)

    const [page, setPage] = useState(1)

    const [totalCount, setTotalCount] = useState(0)

    const [getCourses, isCoursesLoading, coursesError] = useFetching(async () =>{
        const [totalCount, newCourses] = await CourseService.getAll({
            params: {
                ...params,
                skip: (page - 1) * params.take,

            }
        })
        setCourses([...newCourses])
        setTotalCount(totalCount)
    })

    const createCourse = (course) => {
        setCourses([...courses, course])
        setModal(false)
        setTotalCount(totalCount + 1)
    }

    const removeCourse = (id) => {
        setCourses(courses.filter(c => c.id !== id))
        setTotalCount(totalCount - 1)
    }


    useEffect( () => {
        getCourses();
    }, [page, courses.length])

    const changePage = (page) => {
        setPage(page)
    }


    const [modal, setModal] = useState(false)

    return (
        <div className="main">
            <MyButton onClick={() => setModal(true)}>Add course</MyButton>
            <MyModal visible={modal} setVisible={setModal}>
                <CourseForm create={createCourse}/>
            </MyModal>
            <div>
                {isCoursesLoading
                    ? <div>Loading...</div>
                    : <CourseList remove={removeCourse} courses={courses} title="Courses"/>
                }
                {coursesError &&
                <div>{coursesError}</div>
                }
                <MyPagination page={page} pageSize={params.take} pageCount={courses.length} totalCount={totalCount} changePage={changePage} />

            </div>
        </div>
    );
}

export default Courses;
