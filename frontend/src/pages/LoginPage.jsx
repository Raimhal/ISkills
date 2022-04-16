import React, {useState} from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import UserService from "../API/UserService";
import MyInput from "../components/UI/input/MyInput";
import MyButton from "../components/UI/button/MyButton";
import {useDispatch} from "react-redux";
import {loginAction, setIsAuth, setTokens} from "../store/UserReducer";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate()

    const dispatch = useDispatch()

    const initialState = {
        email: "",
        password: ""
    }
    const [user, setUser] = useState(initialState)

    const login = async (e) => {
        e.preventDefault()
        console.log("done")
        const data = await UserService.Login(user)
        const tokens = {
            accessToken: data.jwtToken,
            refreshToken: data.refreshToken
        }
        localStorage.setItem('accessToken', tokens.accessToken)
        localStorage.setItem('refreshToken', tokens.refreshToken)
        dispatch(setTokens(tokens))
        dispatch(setIsAuth(true))
        navigate('/courses')
    }

    return (
        <form className="user__form" onSubmit={login}>
            <MyInput type="text" onChange={e => setUser({...user, email: e.target.value})} placeholder="Email"/>
            <MyInput type="text" onChange={e => setUser({...user, password: e.target.value})} placeholder="Password"/>
            <MyButton type="submit">Log in</MyButton>
        </form>
    );
};

export default LoginPage;