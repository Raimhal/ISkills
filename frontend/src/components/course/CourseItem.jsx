import React from 'react';
import {useNavigate} from 'react-router-dom'
import '../../styles/Course.css'
import '../../styles/Button.css'
import MyRating from "../UI/rating/MyRating";
import defaultCourseImage from '../../assets/images/defaultCourseImage.png'
import ReactHtmlParser from "react-html-parser";
import MyEditor from "../UI/editor/MyEditor";
import MyTextarea from "../UI/textarea/MyTextarea";


const CourseItem = ({course, remove, userId, isAdmin}) => {
    const navigate = useNavigate();
    const hasAccess = (userId === course.creatorId || isAdmin)


    const removeHandleClick = (e) => {
        e.stopPropagation()
        remove(course.id)
    }
    return (
        <div className="course__item" onClick={() => navigate(`/courses/${course.id}`)}>
            <div className="course">
                <img src={course.imageUrl || defaultCourseImage} alt="course image" className="course__image"/>
                <div className="course__content">
                    <h3>{course.title}</h3>
                    <MyRating value={course.rating} readonly/>
                    <MyTextarea value={course.shortInfo} />
                    <div>{course.language}</div>
                </div>
            </div>
            <div className='course__content'>
                {hasAccess &&
                    <div className="course__btns">
                        <button className="cancelButton" onClick={removeHandleClick}>X</button>
                    </div>
                }
                <div>
                    {course.price !== 0
                        ? <div>{course.price} $</div>
                        : <div>For free</div>
                    }
                </div>
            </div>
        </div>
    );
};

export default CourseItem;