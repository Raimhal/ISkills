import React from 'react';
import {useNavigate} from 'react-router-dom'
import '../../styles/Button.css'
import '../../styles/Comment.css'
import MyRating from "../UI/rating/MyRating";
import defaultUserImage from "../../assets/images/defaultUserImage.png";
import MyEditor from "../UI/editor/MyEditor";


const CommentItem = ({comment, remove}) => {
    const navigate = useNavigate();

    const removeHandleClick = (e) => {
        e.stopPropagation()
        remove(comment.id)
    }

    return (
        <div key={comment.id} className="comment">
            <div className="comment__body">
                <img src={comment.creator.imageUrl || defaultUserImage}
                     alt='user image' className='user__image'/>
                <div>
                    {comment.creator.firstName} {comment.creator.lastName} ({comment.creator.userName})
                    <MyRating value={comment.rating} readonly/>
                    <MyEditor defaultValue={comment.content} readonly/>
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