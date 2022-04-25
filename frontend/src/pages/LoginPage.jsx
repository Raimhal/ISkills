import React, {useState} from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import UserService from "../API/UserService";
import MyInput from "../components/UI/input/MyInput";
import MyButton from "../components/UI/button/MyButton";
import {useDispatch, useSelector} from "react-redux";
import {loginAction, setIsAdmin, setIsAuth, setUser} from "../store/UserReducer";
import {useNavigate} from "react-router-dom";
import jwt_decode from "jwt-decode";

const LoginPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)

    const login = async (e) => {
        e.preventDefault()
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
    }

    return (
        <form className="user__form" onSubmit={login}>
            <MyInput type="text" onChange={e => dispatch(setUser({...user, email: e.target.value}))} placeholder="Email"/>
            <MyInput type="text" onChange={e => dispatch(setUser({...user, password: e.target.value}))} placeholder="Password"/>
            <MyButton type="submit">Log in</MyButton>
        </form>
    );
};

export default LoginPage;