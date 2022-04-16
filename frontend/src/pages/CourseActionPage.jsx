import React from 'react';
import {useLocation} from "react-router-dom";
import CourseService from "../API/CourseService";
import {token} from "../router/token";

const CourseActionPage = () => {
    const location = useLocation()

    const updateCourse = async (course) => {
        await CourseService.Update(course, {
            headers: {
                Authorization: token
            }
        })
    }

    const action = (e) => {
        e.preventDefault()

    }
    console.log(location)
    return (
        <div>
            Action page
        </div>
    );
};

export default CourseActionPage;