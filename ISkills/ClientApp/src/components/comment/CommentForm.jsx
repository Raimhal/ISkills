import React, {useState} from 'react';
import MyInput from "../UI/Input/MyInput";
import MyButton from "../UI/Button/MyButton";
import MySelect from "../UI/Select/MySelect";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import MyEditor from "../UI/Editor/MyEditor";
import MyRating from "../UI/Rating/MyRating";
import {useDispatch, useSelector} from "react-redux";
import {clearComment, setComment} from "../../store/CommentReducer";
import MyAlert from "../UI/Alert/MyAlert";
import Loading from "../UI/Loading/Loading";

const CommentForm = ({action, title, ...props}) => {
    const dispatch = useDispatch()
    const comment = useSelector(state => state.comment.comment)
    const error = useSelector(state => state.comment.error)
    const isLoading = useSelector(state => state.comment.isActionLoading)

    const commentAction = (e) => {
        e.preventDefault()
        action(comment)
        dispatch(clearComment())
    }

    return (
        <form className="form" {...props}>
            <MyEditor defaultValue={comment.content} onChange={value => dispatch(setComment({...comment, content: value}))} placeholder="Enter your comment"/>
            <MyAlert item={error}/>
            <div className="rb_div">
                <MyRating value={comment.rating} onChange={value => dispatch(setComment({...comment, rating: value}))}/>
                <MyButton onClick={commentAction}>{!isLoading ? title : <Loading/>}</MyButton>
            </div>
        </form>
    );
};

export default CommentForm;