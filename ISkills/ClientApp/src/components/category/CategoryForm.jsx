import React from 'react';
import MyInput from "../UI/input/MyInput";
import MyButton from "../UI/button/MyButton";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {useDispatch, useSelector} from "react-redux";
import {setCategory} from "../../store/CategoryReducer";
import * as yup from "yup";
import {useFormik} from "formik";
import MyAlert from "../UI/alert/MyAlert";
import Loading from "../UI/loading/Loading";

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
        <form className="form" onSubmit={formik.handleSubmit}>
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
            />
            <MyAlert item={error}/>
            <MyButton type="submit">{!isLoading ? title : <Loading/>}</MyButton>
        </form>
    );
};

export default CategoryForm;