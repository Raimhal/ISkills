import React, {useState} from 'react';
import MyInput from "../UI/Input/MyInput";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {useDispatch, useSelector} from "react-redux";
import {clearError, setUploadMod, setVideo} from "../../store/VideoReducer";
import MyButton from "../UI/Button/MyButton";
import MySelect from "../UI/Select/MySelect";
import {useFormik} from "formik";
import * as yup from "yup";
import MyAlert from "../UI/Alert/MyAlert";
import MyFormikAlert from "../UI/Alert/MyFormikAlert";
import Loading from "../UI/Loading/Loading";
import InnerLoading from "../UI/Loading/InnerLoading";
import {setCourse} from "../../store/CourseReducer";
import MyUpload from "../UI/Upload/MyUpload";

const VideoForm = ({action, title, submitTitle, setVisible, isModified = false, ...props}) => {
    const dispatch = useDispatch()
    const video = useSelector(state => state.video.video)
    const chapters = useSelector(state => state.chapter.chapters)
    const error = useSelector(state => state.video.error)
    const isLoading = useSelector(state => state.video.isActionLoading)
    const uploadMod = useSelector(state => state.video.uploadMod)

    const videoAction = async () => await action(video)

    const schema = yup.object({
        title: yup
            .string('Enter video title')
            .required('Title is required'),
        chapterId: yup
            .string()
            .required('Chapter is required'),
        url: !uploadMod && yup
            .string("Enter video url")
            .required("Video url is required")
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
                required
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
                    required
                />
                <MyFormikAlert condition={formik.touched.chapterId && Boolean(formik.errors.chapterId)}
                               item={formik.errors.chapterId}/>
            </>
            }
            <p><input type="radio" name="uploadMod" onChange={() => {
                dispatch(setUploadMod(true))
            }} defaultChecked={uploadMod}/> by upload</p>
            <p><input type="radio" name="uploadMod" onChange={() => {
                dispatch(setUploadMod(false))
            }} defaultChecked={!uploadMod}/> by url </p>
            {uploadMod
                ?
                <input
                type="file"
                name="file"
                id="file"
                accept="video/*"
                required={uploadMod}
                />
                :
                <MyInput
                    type="text"
                    name="url"
                    defaultValue={formik.values.url}
                    onChange={e => {
                        formik.handleChange(e)
                        dispatch(setVideo({...video, url: e.target.value}))
                    }}
                    onBlur={formik.handleBlur}
                    label="Video url"
                    error={formik.touched.url && Boolean(formik.errors.url)}
                    helperText={formik.touched.url && formik.errors.url}
                    required
                />
            }
            <MyAlert item={error}/>
            {!isLoading
                ? <MyButton type="submit" onClick={() => dispatch(clearError())}>{title}</MyButton>
                : <InnerLoading/>
            }
        </form>
    );
};

export default VideoForm;