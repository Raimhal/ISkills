import React from 'react';
import MyInput from "../UI/Input/MyInput";
import MyButton from "../UI/Button/MyButton";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import MyEditor from "../UI/Editor/MyEditor";
import {useDispatch, useSelector} from "react-redux";
import {setChapter} from "../../store/ChapterReducer";
import * as yup from "yup";
import {useFormik} from "formik";

import MyAlert from "../UI/Alert/MyAlert";
import Loading from "../UI/Loading/Loading";

const ChapterForm = ({action, title, ...props}) => {
    const chapter = useSelector(state => state.chapter.chapter)
    const dispatch = useDispatch()
    const error = useSelector(state => state.chapter.error)
    const isLoading = useSelector(state => state.chapter.isLoading)

    const chapterAction = async () => await action()

    const schema = yup.object({
        title: yup
            .string('Enter title')
            .max(256)
            .required('Title is required'),
        description: yup
            .string('Enter description')
            .nullable()

    });

    const formik = useFormik({
        initialValues: chapter,
        validationSchema: schema,
        onSubmit: chapterAction
    })

    return (
        <form className="form" onSubmit={formik.handleSubmit}>
            <div className="block">
                <MyInput
                    type="text"
                    name="title"
                    defaultValue={formik.values.title}
                    onChange={e => {
                        formik.handleChange(e)
                        dispatch(setChapter({...chapter, title: e.target.value}))
                    }}
                    onBlur={formik.handleBlur}
                    label="Title"
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                />
            </div>
            <div className="block">
                Description :
                <MyEditor
                    name="description"
                    defaultValue={formik.values.description}
                    onChange={value => {
                        formik.setValues({...formik.values, description: value})
                        dispatch(setChapter({...chapter, description: value}))
                    }}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                />
            </div>
            <MyAlert type="error" item={error}/>
            <MyButton type="submit">{!isLoading ? title : <Loading/>}</MyButton>
        </form>
    );
};

export default ChapterForm;