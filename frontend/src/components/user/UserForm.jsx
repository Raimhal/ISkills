import React, {useState} from 'react';
import MyInput from "../UI/input/MyInput";
import MyButton from "../UI/button/MyButton";
import defaultUserImage from "../../assets/images/defaultUserImage.png";

const UserForm = ({action, title, defaultState = {}, ...props}) => {
    const [currentUser, setCurrentUser] = useState({...defaultState, password: ''})

    const userAction = (e) => {
        e.preventDefault()
        console.log(currentUser)
        action(currentUser)
    }

    return (
        <form className="user__form" onSubmit={userAction}>
            <MyInput type="text" value={currentUser.userName} onChange={e => setCurrentUser({...currentUser, userName: e.target.value})} placeholder="Username"/>
            <MyInput type="text" value={currentUser.email} onChange={e => setCurrentUser({...currentUser, email: e.target.value})} placeholder="Email"/>
            <MyInput type="text" value={currentUser.firstName} onChange={e => setCurrentUser({...currentUser, firstName: e.target.value})} placeholder="Firstname"/>
            <MyInput type="text" value={currentUser.lastName} onChange={e => setCurrentUser({...currentUser, lastName: e.target.value})} placeholder="Lastname"/>
            <MyInput type="text" onChange={e => setCurrentUser({...currentUser, password: e.target.value})} placeholder="Password"/>
            <MyInput type="text" onChange={e => setCurrentUser({...currentUser, confirmPassword: e.target.value})} placeholder="Confirm password"/>
            <MyButton>{title}</MyButton>
        </form>
    );
};

export default UserForm;