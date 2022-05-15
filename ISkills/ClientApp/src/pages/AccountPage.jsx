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
import {getCurrentUser, setUser, updateImage, updateUser} from "../store/UserReducer";
import MyModal from "../components/UI/MyModal/MyModal";
import VideoForm from "../components/video/VideoForm";
import ImageUpload from "../components/UI/Upload/ImageUpload";
import {Tooltip} from "@material-ui/core";
import {IconButton} from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";

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