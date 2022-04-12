import React, {useEffect, useState} from 'react';
import CourseService from "../API/CourseService";
import {useParams} from "react-router-dom";
import {useFetching} from "../hooks/useFetching";

const CoursePage = () => {

    const {id} = useParams()

    const [course, setCourse] = useState({})

    const [getCourse, isCourseLoading, courseError] = useFetching(async () =>{
        const course = await CourseService.getOne(id)
        setCourse(course)
        console.log(course)
    })

    useEffect(() => {
            getCourse(id)
        }, [])

    return (
        <div>
            Course Page
        </div>
    );
};

export default CoursePage;