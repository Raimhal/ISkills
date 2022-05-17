import React from 'react';
import MyInput from "../UI/input/MyInput";
import MyButton from "../UI/button/MyButton";
import * as yup from "yup";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "../../store/UserReducer";
import MyAlert from "../UI/alert/MyAlert";

const UserForm = ({action, title = null, submitTitle, ...props}) => {
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.user.user)
    const error = useSelector(state => state.user.error)

    const userAction = async () => await action()

    const schema = yup.object({
        userName: yup
            .string('Enter your username')
            .max(64)
            .required('Username is required'),
        email: yup
            .string('Enter your email')
            .max(64)
            .email('Enter a valid email')
            .required('Email is required'),
        firstName: yup
            .string('Enter your firstname')
            .max(64)
            .nullable(),
        lastName: yup
            .string('Enter your lastname')
            .max(64)
            .nullable()
    });

    const formik = useFormik({
        initialValues: currentUser,
        validationSchema: schema,
        onSubmit: userAction
    })


    return (
        <form className="form" onSubmit={formik.handleSubmit} {...props}>
            <h3>{title}</h3>
            <MyInput
                type="text"
                name="userName"
                defaultValue={formik.values.userName}
                onChange={e => {
                    formik.handleChange(e)
                    dispatch(setUser({...currentUser, userName: e.target.value}))
                }}
                onBlur={formik.handleBlur}
                label="Username"
                error={formik.touched.userName && Boolean(formik.errors.userName)}
                helperText={formik.touched.userName && formik.errors.userName}
            />
            <MyInput
                type="text"
                name="email"
                defaultValue={formik.values.email}
                onChange={e => {
                    formik.handleChange(e)
                    dispatch(setUser({...currentUser, email: e.target.value}))
                }}
                onBlur={formik.handleBlur}
                label="Email"
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
            />
            <MyInput
                type="text"
                name="firstName"
                defaultValue={formik.values.firstName}
                onChange={e => {
                    formik.handleChange(e)
                    dispatch(setUser({...currentUser, firstName: e.target.value}))
                }}
                onBlur={formik.handleBlur}
                label="Firstname"
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
            />
            <MyInput
                type="text"
                name="lastName"
                defaultValue={formik.values.lastName}
                onChange={e => {
                    formik.handleChange(e)
                    dispatch(setUser({...currentUser, lastName: e.target.value}))
                }}
                onBlur={formik.handleBlur}
                label="Lastname"
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
            />
            <MyAlert type="error" item={error}/>
            <MyButton type="submit">{submitTitle}</MyButton>
        </form>
    );
};

export default UserForm;