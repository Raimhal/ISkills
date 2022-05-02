import React, {useState} from 'react';
import MyInput from "../UI/input/MyInput";
import MyButton from "../UI/button/MyButton";
import defaultUserImage from "../../assets/images/defaultUserImage.png";

const UserForm = ({action, title, submitTitle, defaultState = {}, ...props}) => {
    const [currentUser, setCurrentUser] = useState({...defaultState, password: ''})

    const userAction = (e) => {
        e.preventDefault()
        console.log(currentUser)
        action(currentUser)
    }

    return (
        <form className="form" onSubmit={userAction} {...props}>
            <MyInput type="text" value={currentUser.userName} onChange={e => setCurrentUser({...currentUser, userName: e.target.value})} label="Username"/>
            <MyInput type="text" value={currentUser.email} onChange={e => setCurrentUser({...currentUser, email: e.target.value})} label="Email"/>
            <MyInput type="text" value={currentUser.firstName} onChange={e => setCurrentUser({...currentUser, firstName: e.target.value})} label="Firstname"/>
            <MyInput type="text" value={currentUser.lastName} onChange={e => setCurrentUser({...currentUser, lastName: e.target.value})} label="Lastname"/>
            <MyInput type="text" value={currentUser.password} onChange={e => setCurrentUser({...currentUser, password: e.target.value})} label="Password"/>
            <MyInput type="text" onChange={e => setCurrentUser({...currentUser, confirmPassword: e.target.value})} label="Confirm password"/>
            <MyButton>{submitTitle}</MyButton>
        </form>
    );
};

export default UserForm;