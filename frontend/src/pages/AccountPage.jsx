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
import {token} from "../router/token";

const AccountPage = () => {
    const [currentUser, setCurrentUser] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        confirmPassword: '',
        password: '',
        imageUrl: defaultUserImage,
        rating: 0
    })

    const [getCurrentUser, isUserLoading, userError] = useFetching(async () => {
        const user = await UserService.getCurrentUser({
            headers: {
                Authorization: token
            }
        })
        setCurrentUser(user)
    })

    const createUser = async (user) => {
        const userId = await UserService.Create(user)
        setCurrentUser([...currentUser, {...user, id: userId}])
    }

    const updateUser = async (user) => {
        await UserService.updateUser(user, {
            headers: {
                Authorization: token
            }
        })
    }

    useEffect(() => {
        getCurrentUser()
    }, [])

    return (
        <div>
            {!isUserLoading &&
            <div>
                <img src={currentUser.imageUrl || defaultUserImage} alt="current user image" className='user__image' />
                <MyRating value={currentUser.rating} readonly={true}/>
                <UserForm action={updateUser} defaultState={currentUser} title="Update"/>
            </div>
            }
        </div>
    );
};

export default AccountPage;