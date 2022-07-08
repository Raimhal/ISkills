import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'
import '../../styles/Button.css'
import '../../styles/Comment.css'
import MyRating from "../UI/Rating/MyRating";
import defaultUserImage from "../../assets/images/defaultUserImage.png";
import MyEditor from "../UI/Editor/MyEditor";
import MyButton from "../UI/Button/MyButton";
import {useDispatch} from "react-redux";
import {clearError, setComment} from "../../store/CommentReducer";
import ReactHtmlParser from "react-html-parser";
import Parse from "html-react-parser"
import MyTextarea from "../UI/Textarea/MyTextarea";
import {IconButton} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import {Tooltip} from "@material-ui/core";
import {setCourse} from "../../store/CourseReducer";
import MyModal from "../UI/MyModal/MyModal";
import MyPlayer from "../video/MyPlayer";
import ConfirmationForm from "../UI/ConfirmationForm/ConfirmationForm";
import moment from "moment";


const CommentItem = ({comment, remove, update, userId, isAdmin}) => {
    const dispatch = useDispatch()
    const [deleteModal, setDeleteModal] = useState(false)
    const handleDelete = (e) => {
        e.stopPropagation()
        dispatch(remove(comment.id))
    }

    const handleUpdateClick = (e) => {
        e.stopPropagation()
        dispatch(clearError())
        dispatch(setComment(comment))
        update()
    }

    return (
        <div key={comment.id} className="comment">
            <div className="comment__body">
                <img src={comment?.creator.imageUrl || defaultUserImage}
                     alt='user image' className='user__image'/>
                <div className="content">
                    <div>
                        {comment.creator.userName}
                        <MyRating value={comment.rating} readonly/>
                        <MyTextarea value={comment.content} />
                    </div>
                    {(userId === comment.creator.id || isAdmin) &&
                    <div className="comment__btns">
                        <Tooltip title="Edit" placement="left">
                            <IconButton aria-label="edit" onClick={handleUpdateClick}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" placement="left">
                            <IconButton aria-label="delete" onClick={(e) => {
                                e.stopPropagation()
                                dispatch(clearError())
                                setDeleteModal(true)
                            }}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    }
                </div>
                {deleteModal &&
                    <MyModal visible={deleteModal} setVisible={setDeleteModal}>
                        <ConfirmationForm title={"Are you sure you want to delete this comment?"} action={handleDelete} setModal={setDeleteModal}/>
                    </MyModal>
                }
            </div>
            <div className='comment__date'>
                {new Date(comment.dateUpdated) > new Date(comment.date)
                    ? <div>Edited {moment(new Date(comment.dateUpdated + "Z")).startOf("second").fromNow()}</div>
                    : <div>{moment(new Date(comment.date + "Z")).startOf('second').fromNow()}</div>
                }
            </div>
        </div>
    );
};

export default CommentItem;