import React, {useEffect, useState} from 'react';
import MyInput from "../UI/input/MyInput";
import MyButton from "../UI/button/MyButton";
import MySelect from "../UI/select/MySelect";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import MyEditor from "../UI/editor/MyEditor";
import {useDispatch, useSelector} from "react-redux";
import {clearCourse, setCourse} from "../../store/CourseReducer";
import CategoryService from "../../API/CategoryService";
import {useFetching} from "../../hooks/useFetching";
import CourseService from "../../API/CourseService";
import ThemeService from "../../API/ThemeService";
import {getAllCategories, setCategories} from "../../store/CategoryReducer";
import {setTheme, setThemes} from "../../store/ThemeReducer";
import * as yup from "yup";
import {useFormik} from "formik";
import {setVideo} from "../../store/VideoReducer";
import MyFormikAlert from "../UI/alert/MyFormikAlert";
import {setChapter} from "../../store/ChapterReducer";
import {setFileType} from "../../store/FileReducer";
import MyAlert from "../UI/alert/MyAlert";

const ThemeForm = ({action, title, ...props}) => {
    const theme = useSelector(state => state.theme.theme)
    const categories = useSelector(state => state.category.categories)
    const dispatch = useDispatch()
    const error = useSelector(state => state.theme.error)


    const themeAction =  async () => await action()

    const schema = yup.object({
        title: yup
            .string('Enter your title')
            .max(256)
            .required('Title is required'),
        categoryId: yup
            .string('Choose course category')
            .required('Category is required'),
    });

    const formik = useFormik({
        initialValues: theme,
        validationSchema: schema,
        onSubmit: themeAction
    })

    useEffect(() => {
        dispatch(getAllCategories())
    })


    return (
        <form className="form" onSubmit={formik.handleSubmit}>
            <MyInput
                type="text"
                name="title"
                defaultValue={formik.values.title}
                onChange={e => {
                    formik.handleChange(e)
                    dispatch(setTheme({...theme, title: e.target.value}))
                }}
                onBlur={formik.handleBlur}
                label="Title"
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
            />
            <MySelect
                name="categoryId"
                value={formik.values.categoryId}
                onChange={value => {
                    formik.setFieldValue("categoryId", value)
                    dispatch(setTheme({...theme, categoryId: value}))
                }}
                onBlur={() => formik.setTouched({...formik.touched, categoryId: true})}
                defaultValue="Category"
                options={categories.map(c => ({name: c.title, value: c.id.toString()}))}
                error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
            />
            <MyFormikAlert condition={formik.touched.categoryId && Boolean(formik.errors.categoryId)} item={formik.errors.categoryId}/>
            <MyAlert item={error}/>
            <MyButton type="submit">{title}</MyButton>
        </form>
    );
};

export default ThemeForm;