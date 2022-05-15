import React, {useState} from 'react';
import MyInput from "../UI/input/MyInput";
import MyButton from "../UI/button/MyButton";
import defaultUserImage from "../../assets/images/defaultUserImage.png";
import {useFetching} from "../../hooks/useFetching";
import {clearVideo, setVideo} from "../../store/VideoReducer";
import * as yup from "yup";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "../../store/UserReducer";
import MyAlert from "../UI/alert/MyAlert";
import {useNavigate} from "react-router-dom";

const RegistrationForm = ({action, title = null, submitTitle, ...props}) => {
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.user.user)
    const error = useSelector(state => state.user.error)
    const navigate = useNavigate()

    const userAction = () => {
        dispatch(action(navigate))
    }

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
            .nullable(),
        password: yup
            .string('Enter your password')
            .min(5, 'Password should be of minimum 5 characters length')
            .max(64, 'Password should be of maximum 64 characters length')
            .required('Password is required'),
        confirmPassword: yup
            .string('Confirm your password')
            .oneOf([yup.ref('password'), null], "Passwords do not match")
            .min(5, 'Password should be of minimum 5 characters length')
            .max(64, 'Password should be of maximum 64 characters length')
            .required('Password is required'),
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
            <MyInput
                type="password"
                name="password"
                defaultValue={formik.values.password}
                onChange={e => {
                    formik.handleChange(e)
                    dispatch(setUser({...currentUser, password: e.target.value}))
                }}
                onBlur={formik.handleBlur}
                label="Password"
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
            />
            <MyInput
                type="password"
                name="confirmPassword"
                defaultValue={formik.values.confirmPassword}
                onChange={e => {
                    formik.handleChange(e)
                    dispatch(setUser({...currentUser, confirmPassword: e.target.value}))
                }}
                onBlur={formik.handleBlur}
                label="Confirm password"
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
            <MyAlert type="error" item={error}/>
            <MyButton type="submit" onClick={() => console.log(formik.errors)}>{submitTitle}</MyButton>
        </form>
    );
};

export default RegistrationForm;