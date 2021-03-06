import React from 'react';
import MyInput from "../UI/Input/MyInput";
import MyButton from "../UI/Button/MyButton";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {useDispatch, useSelector} from "react-redux";
import * as yup from "yup";
import {useFormik} from "formik";
import {clearError, setFileType} from "../../store/FileReducer";
import MyAlert from "../UI/Alert/MyAlert";
import Loading from "../UI/Loading/Loading";
import InnerLoading from "../UI/Loading/InnerLoading";

const FileTypeForm = ({action, title, ...props}) => {
    const type = useSelector(state => state.file.type)
    const dispatch = useDispatch()
    const error = useSelector(state => state.file.error)
    const isLoading = useSelector(state => state.file.isActionLoading)


    const fileAction =  async () => await action()

    const schema = yup.object({
        fileType: yup
            .string('Enter file type')
            .max(7)
            .required('File type is required'),
        fileSize: yup
            .number("Enter file size")
            .typeError('File size must be a number')
            .min(0.1, "File size must be gather than or equal to 0.1 MB")
            .required('File size is required'),
    });

    const formik = useFormik({
        initialValues: type,
        validationSchema: schema,
        onSubmit: fileAction
    })



    return (
        <form className="form" onSubmit={formik.handleSubmit} noValidate>
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
                required
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
                label="Size, MB"
                error={formik.touched.fileSize && Boolean(formik.errors.fileSize)}
                helperText={formik.touched.fileSize && formik.errors.fileSize}
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

export default FileTypeForm;