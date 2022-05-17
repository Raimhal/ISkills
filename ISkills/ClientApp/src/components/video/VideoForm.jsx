import React from 'react';
import MyInput from "../UI/input/MyInput";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {useDispatch, useSelector} from "react-redux";
import {setVideo} from "../../store/VideoReducer";
import MyButton from "../UI/button/MyButton";
import MySelect from "../UI/select/MySelect";
import {useFormik} from "formik";
import * as yup from "yup";
import MyAlert from "../UI/alert/MyAlert";
import MyFormikAlert from "../UI/alert/MyFormikAlert";

const VideoForm = ({action, title, submitTitle, setVisible, isModified = false, ...props}) => {
    const dispatch = useDispatch()
    const video = useSelector(state => state.video.video)
    const chapters = useSelector(state => state.chapter.chapters)
    const error = useSelector(state => state.video.error)
    const isLoading = useSelector(state => state.video.isLoading)


    const videoAction = async () => await action(video)

    const schema = yup.object({
        title: yup
            .string('Enter video title')
            .required('Title is required'),
        chapterId: yup
            .string()
            .required('Chapter is required'),
    });

    const formik = useFormik({
        initialValues: video,
        validationSchema: schema,
        onSubmit: videoAction
    })

    return (
        <form className="form" onSubmit={formik.handleSubmit} id="uploadVideo">
            <MyInput
                type="text"
                name="title"
                defaultValue={formik.values.title}
                onChange={e => {
                    formik.handleChange(e)
                    dispatch(setVideo({...video, title: e.target.value}))
                }}
                onBlur={formik.handleBlur}
                label="Title"
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
            />
            {!isModified &&
            <>
                <MySelect
                    name="chapterId"
                    value={formik.values.chapterId}
                    onChange={value => {
                        formik.setFieldValue("chapterId", value)
                        dispatch(setVideo({...video, chapterId: value}))
                    }}
                    onBlur={() => formik.setTouched({...formik.touched, chapterId: true})}
                    defaultValue="Chapter"
                    options={chapters.map(c => ({name: c.title, value: c.id}))}
                    error={formik.touched.chapterId && Boolean(formik.errors.chapterId)}
                />
                <MyFormikAlert condition={formik.touched.chapterId && Boolean(formik.errors.chapterId)}
                               item={formik.errors.chapterId}/>
            </>
            }
            <input
                type="file"
                name="file"
                id="file"
                accept="video/*"
                required
            />
            <MyAlert item={error}/>
            <MyButton type="submit">{!isLoading ? submitTitle: "Loading..."}</MyButton>
        </form>
    );
};

export default VideoForm;