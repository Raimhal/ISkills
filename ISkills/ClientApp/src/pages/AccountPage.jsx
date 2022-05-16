import React, {useEffect, useState} from 'react';
import defaultUserImage from '../assets/images/defaultUserImage.png'
import UserForm from "../components/user/UserForm";
import MyRating from "../components/UI/rating/MyRating";
import {useDispatch, useSelector} from "react-redux";
import {getCurrentUser, updateImage, updateUser} from "../store/UserReducer";
import MyModal from "../components/UI/MyModal/MyModal";
import ImageUpload from "../components/UI/Upload/ImageUpload";
import {Tooltip} from "@material-ui/core";

const AccountPage = () => {
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.user.user)
    const isLoading = useSelector(state => state.user.isLoading)
    const [modal, setModal] = useState(false)

    useEffect(() => {
        dispatch(getCurrentUser())
    }, [])

    return (
        <div className="wide main account">
            {!isLoading &&
                <div className="top">
                    <div className="look-up">
                        <div style={{position: "relative"}}>
                            <Tooltip title="Update image" placement="bottom">
                            <img
                                src={ currentUser.imageUrl || defaultUserImage}
                                alt="current user image"
                                className='user__image'
                                onClick={() => setModal(true)}
                            />
                            </Tooltip>
                        </div>
                        {modal && <MyModal visible={modal} setVisible={setModal}>
                            <ImageUpload
                                action={() => {
                                    dispatch(updateImage())
                                    setModal(false)
                                }}
                                title="Update image"
                                submitTitle="Save"
                                setVisible={setModal}
                            />
                        </MyModal>
                        }
                        <MyRating value={currentUser.rating} readonly/>
                    </div>
                    <div>
                        <UserForm action={() => {
                            dispatch(updateUser())
                        }} submitTitle="Save"/>
                    </div>
                </div>
            }
        </div>
    );
};

export default AccountPage;