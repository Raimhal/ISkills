import React from 'react';
import MyInput from "../UI/Input/MyInput";
import MyButton from "../UI/Button/MyButton";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {useDispatch, useSelector} from "react-redux";
import {clearError, setCategory} from "../../store/CategoryReducer";
import * as yup from "yup";
import {useFormik} from "formik";
import MyAlert from "../UI/Alert/MyAlert";
import Loading from "../UI/Loading/Loading";
import InnerLoading from "../UI/Loading/InnerLoading";

const CategoryForm = ({action, title, ...props}) => {
    const category = useSelector(state => state.category.category)
    const dispatch = useDispatch()
    const error = useSelector(state => state.category.error)
    const isLoading = useSelector(state => state.category.isActionLoading)

    const categoryAction =  async () => await action()

    const schema = yup.object({
        title: yup
            .string('Enter your title')
            .max(256)
            .required('Title is required'),
    });

    const formik = useFormik({
        initialValues: category,
        validationSchema: schema,
        onSubmit: categoryAction
    })

    return (
        <form className="form" onSubmit={formik.handleSubmit} noValidate>
            <MyInput
                type="text"
                name="title"
                defaultValue={formik.values.title}
                onChange={e => {
                    formik.handleChange(e)
                    dispatch(setCategory({...category, title: e.target.value}))
                }}
                onBlur={formik.handleBlur}
                label="Title"
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                required
            />
            <MyAlert item={error}/>
            {!isLoading
                ? <MyButton type="submit" onClick={() => dispatch(clearError())}>{title}</MyButton>
                : <InnerLoading/>
            }
        </form>
    );
};

export default CategoryForm;