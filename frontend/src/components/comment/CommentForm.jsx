import React, {useState} from 'react';
import MyInput from "../UI/input/MyInput";
import MyButton from "../UI/button/MyButton";
import MySelect from "../UI/select/MySelect";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import MyEditor from "../UI/editor/MyEditor";
import MyRating from "../UI/rating/MyRating";

const CommentForm = ({action, title, defaultState, ...props}) => {
    const initialCommentState = {
        content: '',
        courseId: '',
        rating: 5
    }

    const [comment, setComment] = useState(defaultState || initialCommentState)
    const commentAction = (e) => {
        e.preventDefault()
        console.log(comment)
        action(comment)
        setComment(initialCommentState)
    }

    return (
        <form className="comment__form" {...props}>
            <MyEditor onChange={value => setComment({...comment, content: value})} placeholder="Enter your comment"/>
            <div className="rb_div">
                <MyRating value={comment.rating} onChange={value => setComment({...comment, rating: value})}/>
                <MyButton onClick={commentAction}>{title}</MyButton>
            </div>
        </form>
    );
};

export default CommentForm;