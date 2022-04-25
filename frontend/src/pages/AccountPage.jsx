import React, {useEffect, useState} from 'react';
import defaultUserImage from '../assets/images/defaultUserImage.png'
import UserService from "../API/UserService";
import MyInput from "../components/UI/input/MyInput";
import MyEditor from "../components/UI/editor/MyEditor";
import MySelect from "../components/UI/select/MySelect";
import MyButton from "../components/UI/button/MyButton";
import CourseService from "../API/CourseService";
import UserForm from "../components/user/UserForm";
import {getAuthHeader} from "../router/instance";
import {useFetching} from "../hooks/useFetching";
import MyRating from "../components/UI/rating/MyRating";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "../store/UserReducer";

const AccountPage = () => {
    const dispatch = useDispatch()
     const currentUser = useSelector(state => state.user.user)

    const [getCurrentUser, isUserLoading, userError] = useFetching(async () => {
        const user = await UserService.getCurrentUser()
        dispatch(setUser(user))
    })

    const updateUser = async (user) => {
        await UserService.updateUser(user.id, user)
    }

    useEffect(() => {
        getCurrentUser()
    }, [])

    return (
        <div className="wide main account">
            {!isUserLoading &&
                <div className="top">
                    <div className="look-up">
                        <img src={ defaultUserImage} alt="current user image" className='user__image' />
                        <MyRating value={currentUser.rating} readonly/>
                    </div>
                    <div>
                        <UserForm action={updateUser} defaultState={currentUser} title="Update"/>
                    </div>
                </div>
            }
        </div>
    );
}

export default AccountPage;