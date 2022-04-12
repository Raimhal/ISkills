import React from 'react';
import {useNavigate} from 'react-router-dom'
import '../styles/Course.css'
import '../styles/Button.css'
import MyRating from "./UI/rating/MyRating";


const CourseItem = ({course, remove}) => {
    const navigate = useNavigate();

    const removeHandleClick = (e) => {
        e.stopPropagation()
        remove(course.id)
    }
    return (
        <div className="course__item" onClick={() => navigate(`/courses/${course.id}`)}>
            <div className="course">
                <img src={course.imageUrl} alt="course image" className="course__image"/>
                <div className="course__content">
                    <h3>{course.title}</h3>
                    <MyRating value={course.rating} readonly={true}/>
                    <div>{course.shortInfo}</div>
                    <div>{course.language}</div>
                </div>
            </div>
            <div className='course__content'>
                <div className="course__btns">
                    <button className="cancelButton" onClick={removeHandleClick}>X</button>
                </div>
                <div>
                    {course.price !== null
                        ? <div>{course.price} $</div>
                        : <div>For free</div>
                    }
                </div>
            </div>
        </div>
    );
};

export default CourseItem;