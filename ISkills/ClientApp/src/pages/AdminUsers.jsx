import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MyTable from "../components/UI/Table/MyTable";
import MyPagination from "../components/UI/Pagination/MyPagination";
import SortAndSearch from "../components/UI/SortAndSearch/SortAndSearch";
import {
    clearError,
    clearUser, clearUsers, getCurrentUser,
    getUsers,
    removeUser,
    setParams,
    setUser,
    updateImage,
    updateUser
} from "../store/UserReducer";
import AdminNavbar from "../components/UI/Navbar/AdminNavbar";
import {Tooltip} from "@material-ui/core";
import defaultUserImage from "../assets/images/defaultUserImage.png";
import {IconButton} from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import MyModal from "../components/UI/MyModal/MyModal";
import CourseForm from "../components/course/CourseForm";
import ImageUpload from "../components/UI/Upload/ImageUpload";
import UserForm from "../components/user/UserForm";

const AdminUsers = () => {
    const users = useSelector(state => state.user.users)
    const params = useSelector(state => state.user.params)
    const sortList = useSelector(state => state.user.sortList)
    const totalCount = useSelector(state => state.user.totalCount)
    const isImageLoading = useSelector(state => state.user.isImageLoading)
    const dispatch = useDispatch()
    const [modal, setModal] = useState(false)
    const [imageModal, setImageModal] = useState(false)
    const error = useSelector(state => state.user.error)
    const isLoading = useSelector(state => state.user.isUsersLoading)

    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    useEffect(() => {
        return () => {
            dispatch(getCurrentUser())
            dispatch(clearUsers())
        }
    }, [])

    useEffect( () =>{
        dispatch(getUsers())
    }, [params.page, params.sortOption, params.reverse])

    return (
        <div>
            {/*<AdminNavbar/>*/}
            {/*{!isLoading &&*/}
                <div className="wide main">
                    <h3 className="title">Users</h3>
                    <SortAndSearch
                        params={params}
                        onParamsChange={value => dispatch(setParams(value))}
                        action={getUsers}
                        sortList={sortList}
                        isLoading={isLoading}
                    />
                    <MyTable
                        title="user"
                        items={users}
                        remove={removeUser}
                        updateClick={(user) => {
                            dispatch(clearError())
                            dispatch(setUser(user))
                            setModal(true)
                        }}
                        iconChildren={ (user) =>
                            <Tooltip title={
                                <img src={user.imageUrl || defaultUserImage} alt="image"/>
                            } placement="bottom">
                                <IconButton aria-label="update image" onClick={() => {
                                    dispatch(setUser(user))
                                    setImageModal(true)
                                }}>
                                    <CameraAltOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                        }
                        error={error}
                        clearError={() => dispatch(clearError())}
                        forbiddenFields={["id", "imageUrl"]}
                    />
                    <MyPagination page={params.page} pageSize={params.take} pageCount={users.length}
                    totalCount={totalCount} changePage={changePage}/>
                    {modal &&
                    <MyModal visible={modal} setVisible={setModal}>
                        <UserForm action={() => {
                            dispatch(updateUser(setModal))
                        }} title="Update" submitTitle="Save"/>
                    </MyModal>
                    }
                    {imageModal && <MyModal visible={imageModal} setVisible={setImageModal}>
                        <ImageUpload
                            action={() => {
                                dispatch(updateImage(setImageModal))
                            }}
                            title="Update image"
                            submitTitle="Save"
                            setVisible={setImageModal}
                            isLoading={isImageLoading}
                            error={error}
                        />
                    </MyModal>
                    }
                </div>
            {/*}*/}
        </div>
    );
};

export default AdminUsers;