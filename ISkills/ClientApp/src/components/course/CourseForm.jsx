import React, {useEffect, useState} from 'react';
import MyInput from "../UI/Input/MyInput";
import MyButton from "../UI/Button/MyButton";
import MySelect from "../UI/Select/MySelect";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import MyEditor from "../UI/Editor/MyEditor";
import {useDispatch, useSelector} from "react-redux";
import {clearError, setCourse} from "../../store/CourseReducer";
import {getAllCategories} from "../../store/CategoryReducer";
import {getAllThemes} from "../../store/ThemeReducer";
import * as yup from "yup";
import {useFormik} from "formik";
import MyFormikAlert from "../UI/Alert/MyFormikAlert";
import MyAlert from "../UI/Alert/MyAlert";
import Loading from "../UI/Loading/Loading";
import InnerLoading from "../UI/Loading/InnerLoading";

const CourseForm = ({action, title, ...props}) => {
    const course = useSelector(state => state.course.course)
    const dispatch = useDispatch()
    const error = useSelector(state => state.course.error)
    const isLoading = useSelector(state => state.course.isActionLoading)

    const [buyMode, setBuyMode] = useState(false)

    const languages = [
        {name: "English", value: "english"},
        {name: "Russian", value: "russian"},
        {name: "Ukrainian", value: "ukrainian"}
    ]

    const themes = useSelector(state => state.theme.themes)
    const categories = useSelector(state => state.category.categories)

    const courseAction = async () => await action(course)

    useEffect(() => {
        dispatch(getAllCategories())
    }, [])

    useEffect(() => {
        dispatch(getAllThemes(course.categoryId))
    }, [course.categoryId])

    const schema = yup.object({
        title: yup
            .string('Enter course title')
            .max(256)
            .required('Title is required'),
        shortInfo: yup
            .string('Enter short information about course')
            .max(1024),
        description: yup
            .string('Enter course description')
            .nullable(),
        requirements: yup
            .string('Enter course requirements')
            .nullable(),
        language: yup
            .string('Enter course language')
            .required('Language is required'),
        categoryId: yup
            .string('Choose course category')
            .required('Category is required'),
        themeId: yup
            .string('Choose course theme')
            .required('Theme is required'),
        price: yup
            .number("Enter course price")
            .typeError('Price must be a number')
            .min(buyMode ? 0.99 : 0)
            .required('Price is required'),
    });

    const formik = useFormik({
        initialValues: course,
        validationSchema: schema,
        onSubmit: courseAction
    })



    return (
        <form className="form" onSubmit={formik.handleSubmit} noValidate>
            {/*<MyFormikAlert condition={formik.touched.chapterId && Boolean(formik.errors.chapterId)} item={formik.errors.chapterId}/>*/}
            <div className="block">
                <MyInput
                    type="text"
                    name="title"
                    defaultValue={formik.values.title}
                    onChange={e => {
                        formik.handleChange(e)
                        dispatch(setCourse({...course, title: e.target.value}))
                    }}
                    onBlur={formik.handleBlur}
                    label="Title"
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                    autoFocus
                    required
                />
            </div>
            <div className="block">
                <MyInput
                    type="text"
                    name="shortInfo"
                    defaultValue={formik.values.shortInfo}
                    onChange={e => {
                        formik.handleChange(e)
                        dispatch(setCourse({...course, shortInfo: e.target.value}))
                    }}
                    onBlur={formik.handleBlur}
                    label="Short information"
                    error={formik.touched.shortInfo && Boolean(formik.errors.shortInfo)}
                    helperText={formik.touched.shortInfo && formik.errors.shortInfo}
                />
            </div>
            <div className="block">
                Description :
                <MyEditor
                    name="description"
                    defaultValue={formik.values.description}
                    onChange={value => {
                        formik.setValues({...formik.values, description: value})
                        dispatch(setCourse({...course, description: value}))
                    }}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                    placeholder="Enter course description"
                />
            </div>
            <div className="block">
                Requirements :
                <MyEditor
                    name="requirements"
                    defaultValue={formik.values.requirements}
                    onChange={value => {
                        formik.setValues({...formik.values, description: value})
                        dispatch(setCourse({...course, requirements: value}))
                    }}
                    error={formik.touched.requirements && Boolean(formik.errors.requirements)}
                    helperText={formik.touched.requirements && formik.errors.requirements}
                    placeholder="Enter course requirements"
                />
            </div>
            <div className="block">
                <MySelect
                    name="language"
                    value={formik.values.language}
                    onChange={value => {
                        formik.setFieldValue("language", value)
                        dispatch(setCourse({...course, language: value}))
                    }}
                    onBlur={() => formik.setTouched({...formik.touched, language: true})}
                    defaultValue="Language"
                    options={languages}
                    error={formik.touched.language && Boolean(formik.errors.language)}
                    required
                />
                <MyFormikAlert condition={formik.touched.language && Boolean(formik.errors.language)} item={formik.errors.language}/>
                <MySelect
                    name="categoryId"
                    value={formik.values.categoryId}
                    onChange={value => {
                        formik.setFieldValue("categoryId", value)
                        dispatch(setCourse({...course, categoryId: value}))
                    }}
                    onBlur={() => formik.setTouched({...formik.touched, categoryId: true})}
                    defaultValue="Category"
                    options={categories.map(c => ({name: c.title, value: c.id.toString()}))}
                    error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
                    required
                />
                <MyFormikAlert condition={formik.touched.categoryId && Boolean(formik.errors.categoryId)} item={formik.errors.categoryId}/>
                {course.categoryId !== undefined && course.categoryId !== null && <div style={{display: "flex", flexDirection: "column"}}>
                    <MySelect
                        name="themeId"
                        value={formik.values.themeId}
                        onChange={value => {
                            formik.setFieldValue("themeId", value)
                            dispatch(setCourse({...course, themeId: value}))
                        }}
                        onBlur={() => formik.setTouched({...formik.touched, themeId: true})}
                        defaultValue="Theme"
                        options={themes.map(c => ({name: c.title, value: c.id.toString()}))}
                        error={formik.touched.themeId && Boolean(formik.errors.themeId)}
                        required
                    />
                    <MyFormikAlert condition={formik.touched.themeId && Boolean(formik.errors.themeId)} item={formik.errors.themeId}/>
                </div>
                }
            </div>
            <div className="block">
                <p><input type="radio" name="buyMode" onChange={() => {
                    setBuyMode(false)
                    formik.setFieldValue("price", 0)
                    dispatch(setCourse({...course, price: 0}))
                }} defaultChecked={course.price === 0}/> free to learn</p>
                <p><input type="radio" name="buyMode" onChange={() => {
                    setBuyMode(true)
                    formik.setFieldValue("price", 0.99)
                    dispatch(setCourse({...course, price: 0.99}))
                }} defaultChecked={course.price !== 0}/> buy to learn </p>
                {course.price !== 0 && <MyInput
                    type="text"
                    name="price"
                    label="Price"
                    defaultValue={formik.values.price}
                    onChange={e => {
                        formik.handleChange(e)
                        dispatch(setCourse({...course, price: e.target.value}))
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.price && Boolean(formik.errors.price)}
                    helperText={formik.touched.price && formik.errors.price}
                    required
                />
                }
            </div>
            <MyAlert item={error}/>
            {!isLoading
                ? <MyButton type="submit" onClick={() => dispatch(clearError())}>{title}</MyButton>
                : <InnerLoading/>
            }
        </form>
    );
};

export default CourseForm;