import React, {useEffect} from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import MyInput from "../components/UI/Input/MyInput";
import MyButton from "../components/UI/Button/MyButton";
import {useDispatch, useSelector} from "react-redux";
import {clearError, clearUser, login, setUser} from "../store/UserReducer";
import {Link, useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import * as yup from 'yup';
import MyAlert from "../components/UI/Alert/MyAlert";
import InnerLoading from "../components/UI/Loading/InnerLoading";

const LoginPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const error = useSelector(state => state.user.error)
    const isLoading = useSelector(state => state.user.isActionLoading)

    const loginAction = () => dispatch(login(navigate))


    const schema = yup.object({
        email: yup
            .string('Enter your email')
            .email('Enter a valid email')
            .required('Email is required'),
        password: yup
            .string('Enter your password')
            .min(5, 'Password should be of minimum 5 characters length')
            .max(64, 'Password should be of maximum 64 characters length')
            .required('Password is required'),
    });

    const formik = useFormik({
        initialValues: user,
        validationSchema: schema,
        onSubmit: loginAction
    })

    useEffect( () => {
        dispatch(clearError())
    }, [])

    return (
        <div className="center">
            <form className="form login" onSubmit={formik.handleSubmit}>
                <h3>Log in</h3>
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
                <MyAlert item={error}/>
                {!isLoading
                    ? <MyButton type="submit" onClick={() => dispatch(clearError())}>Log in</MyButton>
                    : <InnerLoading/>
                }
                <p>
                    I haven't an account :
                    <Link to="/register" className="link"> Sign Up</Link>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;