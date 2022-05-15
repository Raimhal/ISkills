import React from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import UserService from "../API/UserService";
import {createUser, setUser} from "../store/UserReducer";
import RegistrationForm from "../components/user/RegistrationForm";

const RegisterPage = () => {
    return (
        <div className="center">
            <RegistrationForm action={createUser} submitTitle="Sign up" title="Registration" className="form register"/>
        </div>
    );
};

export default RegisterPage;