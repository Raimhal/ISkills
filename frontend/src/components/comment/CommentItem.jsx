import React from 'react';
import {useNavigate} from 'react-router-dom'
import '../../styles/Button.css'
import '../../styles/Comment.css'
import MyRating from "../UI/rating/MyRating";
import defaultUserImage from "../../assets/images/defaultUserImage.png";
import MyEditor from "../UI/editor/MyEditor";
import MyButton from "../UI/button/MyButton";
import {useDispatch} from "react-redux";
import {setComment} from "../../store/CommentReducer";
import ReactHtmlParser from "react-html-parser";
import Parse from "html-react-parser"

const CommentItem = ({comment, remove, update}) => {
    const dispatch = useDispatch()
    const removeHandleClick = (e) => {
        e.stopPropagation()
        remove(comment.id)
    }

    const handleUpdateClick = (e) => {
        e.stopPropagation()
        console.log(comment)
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
                        {comment.creator.firstName} {comment.creator.lastName} ({comment.creator.userName})
                        <MyRating value={comment.rating} readonly/>
                        <div>{ReactHtmlParser(comment.content)}</div>
                    </div>
                    <div className="comment__btns">
                        <MyButton onClick={removeHandleClick}>X</MyButton>
                        <MyButton onClick={handleUpdateClick}>U</MyButton>
                    </div>
                </div>
            </div>
            <div className='comment__date'>
                {comment.dateUpdated === comment.date
                    ? <div>{new Date(comment.date).toLocaleString()}</div>
                    : <div>Edited {new Date(comment.dateUpdated).toLocaleString()}</div>
                }
            </div>
        </div>
    );
};

export default CommentItem;