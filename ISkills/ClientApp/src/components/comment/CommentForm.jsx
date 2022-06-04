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
import InnerLoading from "../UI/Loading/InnerLoading";
import MyFormikAlert from "../UI/Alert/MyFormikAlert";
import {useFormik} from "formik";
import * as yup from "yup";

const CommentForm = ({action, title, ...props}) => {
    const dispatch = useDispatch()
    const comment = useSelector(state => state.comment.comment)
    const error = useSelector(state => state.comment.error)
    const isLoading = useSelector(state => state.comment.isActionLoading)

    const commentAction = async () => await action(comment)
    const schema = yup.object({
        content: yup
            .string('Enter your comment')
            .notOneOf(["<p></p>\n", "<p></p> ", ""], "Comment is required")
            .required("Comment is required")
    });

    const formik = useFormik({
        initialValues: comment,
        validationSchema: schema,
        onSubmit: commentAction
    })

    return (
        <form className="form" {...props} onSubmit={formik.handleSubmit}>
            <MyEditor
                name="content"
                defaultValue={formik.values.content}
                onChange={value => {
                    formik.setValues({...formik.values, content: value})
                    console.log(formik.values)
                    dispatch(setComment({...comment, content: value}))
                }}
                error={formik.touched.content && Boolean(formik.errors.content)}
                helperText={formik.touched.content && formik.errors.content}
                placeholder="Enter your comment"
            />
            <MyFormikAlert condition={formik.touched.content && Boolean(formik.errors.content)} item={formik.errors.content}/>
            <MyAlert item={error}/>
            <div className="rb_div">
                <MyRating value={comment.rating} onChange={value => dispatch(setComment({...comment, rating: value}))}/>
                {!isLoading
                    ? <MyButton
                        type="submit"
                        onClick={() => console.log(formik.errors)}
                        // disabled={formik.values.content.includes("<p></p>", "<p></p> ", "")}
                    >{title}</MyButton>
                    : <InnerLoading/>
                }
            </div>
        </form>
    );
};

export default CommentForm;