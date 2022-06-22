import React, {useEffect} from 'react';
import {clearError, clearUser, createUser} from "../store/UserReducer";
import RegistrationForm from "../components/user/RegistrationForm";
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";

const RegisterPage = () => {
    const dispatch = useDispatch()

    useEffect( () => {
        dispatch(clearError())
    }, [])

    return (
        <div className="center">
            <RegistrationForm
                action={createUser}
                submitTitle="Sign up"
                title="Registration"
                className="form register"
            />
        </div>
    );
};

export default RegisterPage;