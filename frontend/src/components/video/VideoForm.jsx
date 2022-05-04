import React, {useState} from 'react';
import MyInput from "../UI/input/MyInput";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {useDispatch, useSelector} from "react-redux";
import {clearVideo, setVideo} from "../../store/VideoReducer";
import MyButton from "../UI/button/MyButton";
import MySelect from "../UI/select/MySelect";
import Alert from "@mui/material/Alert";
import {ErrorMessage, useFormik} from "formik";
import * as yup from "yup";
import {useFetching} from "../../hooks/useFetching";
import UserService from "../../API/UserService";
import jwt_decode from "jwt-decode";
import {setIsAdmin, setIsAuth, setUser} from "../../store/UserReducer";

const VideoForm = ({action, title, submitTitle, ...props}) => {
    const dispatch = useDispatch()
    const video = useSelector(state => state.video.video)
    const chapters = useSelector(state => state.chapter.chapters)
    // const fileTypes = useSelector(state => state.file.fileTypes || [])

    const [videoAction, isLoading, error] = useFetching( () => {
        action(video)
        dispatch(clearVideo())
    })

    const isCorrectFileType = (files) => {
        let valid = true
        // files?.map(file => {
        //     const allowedFile = fileTypes
        //         .filter(t => t.fileType === file.name.split(".").pop())[0]
        //     if (allowedFile?.fileSize === undefined)
        //         valid = false
        // })
        return valid
    }

    const isCorrectFileSize = (files) => {
        let valid = true
        // files?.map(file => {
        //     const size = file.size / Math.pow(10, 6)
        //     const allowedFile =
        //         fileTypes.filter(t =>
        //             t.fileType === file
        //                 .name.split(".").pop())[0]
        //     if (allowedFile?.fileSize === undefined || size > allowedFile.fileSize)
        //         valid = false
        // })

        return valid
    }

    const schema = yup.object({
        title: yup
            .string('Enter video title')
            .required('Title is required'),
        chapterId: yup
            .mixed()
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
            <MySelect
                name="chapterId"
                value={formik.values.chapterId}
                onChange={value => {
                    formik.setFieldValue("chapterId", value)
                    dispatch(setVideo({...video, chapterId: value}))
                }}
                onBlur={formik.handleBlur}
                defaultValue="Chapter"
                options={chapters.map(c => ({name: c.title, value: c.id}))}
                error={Boolean(formik.errors.chapterId)}
                helperText={formik.touched.chapterId && formik.errors.chapterId}
            />
            {formik.errors.chapterId &&
                <p style={{fontSize: "12px", color: "#d32f2f"}}>{formik.errors.chapterId}</p>
            }
            <input
                type="file"
                name="file"
                id="file"
                required
            />
            {error &&
                <Alert variant="outlined" severity="error" sx={{color: "inherit"}}>{error}</Alert>
            }
            <MyButton type="submit" onClick={() => console.log(formik.errors)}>{submitTitle}</MyButton>
        </form>
    );
};

export default VideoForm;