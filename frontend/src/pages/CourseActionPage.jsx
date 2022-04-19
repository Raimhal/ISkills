import React from 'react';
import {useLocation} from "react-router-dom";
import CourseService from "../API/CourseService";
import {useSelector} from "react-redux";

const CourseActionPage = () => {
    const location = useLocation()
    const token = useSelector(state => state.user.tokens.accessToken)
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