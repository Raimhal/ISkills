import React from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import UserService from "../API/UserService";
import {setUser} from "../store/UserReducer";
import UserForm from "../components/user/UserForm";

const RegisterPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)

    const createUser = async (user) => {
        const userId = await UserService.Create(user)
        dispatch(setUser({...user, id: userId}))
        navigate('/login')
    }

    return (
        <div className="center">
            <UserForm action={createUser} defaultState={user} submitTitle="Sign up" title="Registration" className="form register"/>
        </div>
    );
};

export default RegisterPage;