import React from 'react';
import MyInput from "../UI/input/MyInput";
import MyButton from "../UI/button/MyButton";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {useDispatch, useSelector} from "react-redux";
import * as yup from "yup";
import {useFormik} from "formik";
import {setFileType} from "../../store/FileReducer";
import MyAlert from "../UI/alert/MyAlert";

const FileTypeForm = ({action, title, ...props}) => {
    const type = useSelector(state => state.file.type)
    const dispatch = useDispatch()
    const error = useSelector(state => state.file.error)


    const fileAction =  async () => await action()

    const schema = yup.object({
        fileType: yup
            .string('Enter file type')
            .max(7)
            .required('File type is required'),
        fileSize: yup
            .number("Enter file size")
            .typeError('File size must be a number')
            .min(0)
            .required('File size is required'),
    });

    const formik = useFormik({
        initialValues: type,
        validationSchema: schema,
        onSubmit: fileAction
    })



    return (
        <form className="form" onSubmit={formik.handleSubmit}>
            <MyInput
                type="text"
                name="fileType"
                defaultValue={formik.values.fileType}
                onChange={e => {
                    formik.handleChange(e)
                    dispatch(setFileType({...type, fileType: e.target.value}))
                }}
                onBlur={formik.handleBlur}
                label="Type"
                error={formik.touched.fileType && Boolean(formik.errors.fileType)}
                helperText={formik.touched.fileType && formik.errors.fileType}
            />
            <MyInput
                type="text"
                name="fileSize"
                defaultValue={formik.values.fileSize}
                onChange={e => {
                    formik.handleChange(e)
                    dispatch(setFileType({...type, fileSize: e.target.value}))
                }}
                onBlur={formik.handleBlur}
                label="Size"
                error={formik.touched.fileSize && Boolean(formik.errors.fileSize)}
                helperText={formik.touched.fileSize && formik.errors.fileSize}
            />
            <MyAlert item={error}/>
            <MyButton type="submit">{title}</MyButton>
        </form>
    );
};

export default FileTypeForm;