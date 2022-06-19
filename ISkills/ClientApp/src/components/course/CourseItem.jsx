import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'
import '../../styles/Course.css'
import '../../styles/Button.css'
import MyRating from "../UI/Rating/MyRating";
import defaultCourseImage from '../../assets/images/defaultCourseImage.png'
import ReactHtmlParser from "react-html-parser";
import MyEditor from "../UI/Editor/MyEditor";
import MyTextarea from "../UI/Textarea/MyTextarea";
import DeleteIcon from '@mui/icons-material/Delete';

import {IconButton} from '@mui/material';
import {Tooltip} from "@material-ui/core";
import {useDispatch} from "react-redux";
import languageImage from "../../assets/images/language.png";
import MyInput from "../UI/Input/MyInput";
import MyModal from "../UI/MyModal/MyModal";
import ConfirmationDeleteForm from "../UI/ConfirmationDeleteForm/ConfirmationDeleteForm";


const CourseItem = ({course, remove, userId, isAdmin}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const hasAccess = (userId === course.creatorId || isAdmin)
    const [deleteModal, setDeleteModal] = useState(false)


    const removeHandleClick = (e) => {
        e.stopPropagation()
        dispatch(remove(course.id))
    }
    return (
        <div className="course__item" onClick={() => navigate(`/courses/${course.id}`)}>
            <div className="course">
                <img src={course.imageUrl || defaultCourseImage} alt="course image" className="course__image"/>
                <div className="course__content">
                    <div>
                        <h3>{course.title}</h3>
                        {course.rating > 0 && <MyRating value={course.rating} readonly/>}
                        <div className="language">
                            <img src={languageImage} alt="language : " style={{width: 16}}/>
                            <div>{course.language}</div>
                        </div>
                        <div className="shortInfo">
                            {course.shortInfo.length > 131 ? `${course.shortInfo.slice(0, 128)}...` : course.shortInfo}
                        </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                        <div style={{whiteSpace: "nowrap"}}>
                            {course.price !== 0
                                ? <div>{course.price} $</div>
                                : <div>Free</div>
                            }
                        </div>
                        {hasAccess &&
                        <div className="course__btns">
                            <Tooltip title="Delete" placement="left">
                                <IconButton aria-label="delete" onClick={(e) => {
                                    e.stopPropagation()
                                    setDeleteModal(true)
                                }}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                            {deleteModal &&
                                <MyModal visible={deleteModal} setVisible={setDeleteModal}>
                                    <ConfirmationDeleteForm title="comment" remove={removeHandleClick} setDeleteModal={setDeleteModal}/>
                                </MyModal>
                            }
                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseItem;