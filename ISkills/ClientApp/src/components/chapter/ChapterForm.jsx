import React, {useEffect, useState} from 'react';
import MyInput from "../UI/input/MyInput";
import MyButton from "../UI/button/MyButton";
import MySelect from "../UI/select/MySelect";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import MyEditor from "../UI/editor/MyEditor";
import {useDispatch, useSelector} from "react-redux";
import {clearChapter, setChapter} from "../../store/ChapterReducer";
import CategoryService from "../../API/CategoryService";
import {useFetching} from "../../hooks/useFetching";
import ChapterService from "../../API/ChapterService";
import ThemeService from "../../API/ThemeService";
import {setCategories} from "../../store/CategoryReducer";
import {setThemes} from "../../store/ThemeReducer";
import {setCourse} from "../../store/CourseReducer";
import * as yup from "yup";
import {useFormik} from "formik";
import {setUser} from "../../store/UserReducer";
import MyAlert from "../UI/alert/MyAlert";

const ChapterForm = ({action, title, ...props}) => {
    const chapter = useSelector(state => state.chapter.chapter)
    const dispatch = useDispatch()

    const [chapterAction, isLoading, error] = useFetching( async () => {
        action(chapter)
    })

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
            <MyButton type="submit">{title}</MyButton>
        </form>
    );
};

export default ChapterForm;