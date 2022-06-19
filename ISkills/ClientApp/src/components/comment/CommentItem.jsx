import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'
import '../../styles/Button.css'
import '../../styles/Comment.css'
import MyRating from "../UI/Rating/MyRating";
import defaultUserImage from "../../assets/images/defaultUserImage.png";
import MyEditor from "../UI/Editor/MyEditor";
import MyButton from "../UI/Button/MyButton";
import {useDispatch} from "react-redux";
import {setComment} from "../../store/CommentReducer";
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
import ConfirmationDeleteForm from "../UI/ConfirmationDeleteForm/ConfirmationDeleteForm";


const CommentItem = ({comment, remove, update, userId, isAdmin}) => {
    const dispatch = useDispatch()
    const [deleteModal, setDeleteModal] = useState(false)
    const handleDelete = (e) => {
        e.stopPropagation()
        dispatch(remove(comment.id))
    }

    const handleUpdateClick = (e) => {
        e.stopPropagation()
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
                        <ConfirmationDeleteForm title="comment" remove={handleDelete} setDeleteModal={setDeleteModal}/>
                    </MyModal>
                }
            </div>
            <div className='comment__date'>
                {comment.dateUpdated > comment.date
                    ? <div>Edited {new Date(comment.dateUpdated).toLocaleString()}</div>
                    : <div>{new Date(comment.date).toLocaleString()}</div>
                }
            </div>
        </div>
    );
};

export default CommentItem;