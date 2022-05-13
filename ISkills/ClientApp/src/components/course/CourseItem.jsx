import React from 'react';
import {useNavigate} from 'react-router-dom'
import '../../styles/Course.css'
import '../../styles/Button.css'
import MyRating from "../UI/rating/MyRating";
import defaultCourseImage from '../../assets/images/defaultCourseImage.png'
import ReactHtmlParser from "react-html-parser";
import MyEditor from "../UI/editor/MyEditor";
import MyTextarea from "../UI/textarea/MyTextarea";
import DeleteIcon from '@mui/icons-material/Delete';

import {IconButton} from '@mui/material';
import {Tooltip} from "@material-ui/core";
import {useDispatch} from "react-redux";
import languageImage from "../../assets/images/language.png";
import MyInput from "../UI/input/MyInput";


const CourseItem = ({course, remove, userId, isAdmin}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const hasAccess = (userId === course.creatorId || isAdmin)


    const removeHandleClick = (e) => {
        e.stopPropagation()
        dispatch(remove(course.id))
    }
    return (
        <div className="course__item" onClick={() => navigate(`/courses/${course.id}`)}>
            <div className="course">
                <img src={course.imageUrl || defaultCourseImage} alt="course image" className="course__image"/>
                <div className="course__content">
                    <h3>{course.title}</h3>
                    <MyRating value={course.rating} readonly/>
                    <div className="language">
                        <img src={languageImage} alt="language : " style={{width: 16}}/>
                        <div>{course.language}</div>
                    </div>
                    <div className="shortInfo">
                        {course.shortInfo.length > 515 ? `${course.shortInfo.slice(0, 512)}...` : course.shortInfo}
                    </div>
                </div>
            </div>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                <div style={{whiteSpace: "nowrap"}}>
                    {course.price !== 0
                        ? <div>{course.price} $</div>
                        : <div>For free</div>
                    }
                </div>
                {hasAccess &&
                    <div className="course__btns">
                        <Tooltip title="Delete" placement="left">
                            <IconButton aria-label="delete" onClick={removeHandleClick}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                }
            </div>
        </div>
    );
};

export default CourseItem;