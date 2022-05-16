import React, {useState} from 'react';
import MyInput from "../UI/input/MyInput";
import MyButton from "../UI/button/MyButton";
import MySelect from "../UI/select/MySelect";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import MyEditor from "../UI/editor/MyEditor";
import MyRating from "../UI/rating/MyRating";
import {useDispatch, useSelector} from "react-redux";
import {clearComment, setComment} from "../../store/CommentReducer";
import MyAlert from "../UI/alert/MyAlert";

const CommentForm = ({action, title, ...props}) => {
    const dispatch = useDispatch()
    const comment = useSelector(state => state.comment.comment)
    const error = useSelector(state => state.comment.error)

    const commentAction = (e) => {
        e.preventDefault()
        action(comment)
        dispatch(clearComment())
    }

    return (
        <form className="form" {...props}>
            <MyEditor defaultValue={comment.content} onChange={value => dispatch(setComment({...comment, content: value}))} placeholder="Enter your comment"/>
            <div className="rb_div">
                <MyRating value={comment.rating} onChange={value => dispatch(setComment({...comment, rating: value}))}/>
                <MyAlert item={error}/>
                <MyButton onClick={commentAction}>{title}</MyButton>
            </div>
        </form>
    );
};

export default CommentForm;