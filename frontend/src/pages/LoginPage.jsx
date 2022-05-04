import React, {useState} from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import UserService from "../API/UserService";
import MyInput from "../components/UI/input/MyInput";
import MyButton from "../components/UI/button/MyButton";
import {useDispatch, useSelector} from "react-redux";
import {loginAction, setIsAdmin, setIsAuth, setUser} from "../store/UserReducer";
import {useNavigate} from "react-router-dom";
import jwt_decode from "jwt-decode";
import {useFormik} from "formik";
import * as yup from 'yup';
import {useFetching} from "../hooks/useFetching";
import ChapterService from "../API/ChapterService";
import {setChapters} from "../store/ChapterReducer";
import Alert from '@mui/material/Alert';

const LoginPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)

    const [login, isLoginLoading, error] = useFetching(async () => {

        const data = await UserService.Login(user)
        const decode = jwt_decode(data.jwtToken)
        const isAdmin = decode["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "Admin"
        console.log(isAdmin)
        localStorage.setItem('currentUser', JSON.stringify(data))
        localStorage.setItem('isAuth', true)
        localStorage.setItem('isAdmin', isAdmin)
        dispatch(setIsAuth(true))
        dispatch(setUser(data))
        dispatch(setIsAdmin(isAdmin))
        navigate('/courses')
    })

    const schema = yup.object({
        email: yup
            .string('Enter your email')
            .email('Enter a valid email')
            .required('Email is required'),
        password: yup
            .string('Enter your password')
            .min(5, 'Password should be of minimum 5 characters length')
            .required('Password is required'),
    });

    const formik = useFormik({
        initialValues: user,
        validationSchema: schema,
        onSubmit: login
    })

    return (
        <div className="center">
            <form className="form login" onSubmit={formik.handleSubmit}>
                <p>Log in</p>
                <MyInput
                    type="text"
                    name="email"
                    value={formik.values.email}
                    onChange={e => {
                        formik.handleChange(e)
                        dispatch(setUser({...user, email: e.target.value}))
                    }}
                    onBlur={formik.handleBlur}
                    label="Email"
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <MyInput
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={e => {
                        formik.handleChange(e)
                        dispatch(setUser({...user, password: e.target.value}))
                    }}
                    onBlur={formik.handleBlur}
                    label="Password"
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
                {error &&
                    <Alert variant="outlined" severity="error" sx={{color: "inherit"}}>{error}</Alert>
                }
                <MyButton type="submit">Log in</MyButton>
            </form>
        </div>
    );
};

export default LoginPage;