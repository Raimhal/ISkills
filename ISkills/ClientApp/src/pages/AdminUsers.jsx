import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MyTable from "../components/UI/table/MyTable";
import MyPagination from "../components/UI/pagination/MyPagination";
import SortAndSearch from "../components/UI/sortAndSearch/SortAndSearch";
import {getUsers, removeUser, setParams, setUser, updateImage, updateUser} from "../store/UserReducer";
import AdminNavbar from "../components/UI/navbar/AdminNavbar";
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
    const isLoading = useSelector(state => state.user.isLoading)
    const dispatch = useDispatch()
    const [modal, setModal] = useState(false)
    const [imageModal, setImageModal] = useState(false)

    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    useEffect( () =>{
        dispatch(getUsers())
    }, [params.page, params.sortOption, params.reverse])

    return (
        <div>
            <AdminNavbar/>
            {/*{!isLoading &&*/}
                <div className="wide main">
                    <h2>Users</h2>
                    <SortAndSearch
                        params={params}
                        onParamsChange={value => dispatch(setParams(value))}
                        action={getUsers}
                        sortList={sortList}
                    />
                    <MyTable
                        items={users}
                        remove={removeUser}
                        updateClick={(user) => {
                            dispatch(setUser(user))
                            setModal(true)
                        }}
                        iconChildren={ (url, user) =>
                            <Tooltip title={
                                <img src={url || defaultUserImage} alt="image"/>
                            } placement="bottom">
                                <IconButton aria-label="update image" onClick={() => {
                                    dispatch(setUser(user))
                                    setImageModal(true)
                                }}>
                                    <CameraAltOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                        }
                    />
                    <MyPagination page={params.page} pageSize={params.take} pageCount={users.length}
                    totalCount={totalCount} changePage={changePage}/>
                    {modal &&
                    <MyModal visible={modal} setVisible={setModal}>
                        <UserForm action={() => {
                            dispatch(updateUser())
                            setModal(false)
                        }} title="Update" submitTitle="Save"/>
                    </MyModal>
                    }
                    {imageModal && <MyModal visible={imageModal} setVisible={setImageModal}>
                        <ImageUpload
                            action={() => {
                                dispatch(updateImage())
                                setImageModal(false)
                            }}
                            title="Update image"
                            submitTitle="Save"
                            setVisible={setImageModal}
                        />
                    </MyModal>
                    }
                </div>
            {/*}*/}
        </div>
    );
};

export default AdminUsers;