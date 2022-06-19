import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MyTable from "../components/UI/Table/MyTable";
import MyPagination from "../components/UI/Pagination/MyPagination";
import SortAndSearch from "../components/UI/SortAndSearch/SortAndSearch";
import {getVideos, removeVideo, setParams, setVideo, updateVideo} from "../store/VideoReducer";
import AdminNavbar from "../components/UI/Navbar/AdminNavbar";
import Loading from "../components/UI/Loading/Loading";
import MyModal from "../components/UI/MyModal/MyModal";
import VideoForm from "../components/video/VideoForm";
import {Tooltip} from "@material-ui/core";
import {IconButton} from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import MyPlayer from "../components/video/MyPlayer";

const AdminVideos = () => {
    const video = useSelector(state => state.video.video)
    const videos = useSelector(state => state.video.videos)
    const params = useSelector(state => state.video.params)
    const sortList = useSelector(state => state.video.sortList)
    const totalCount = useSelector(state => state.video.totalCount)
    const dispatch = useDispatch()
    const [modal, setModal] = useState(false)
    const [viewModal, setViewModal] = useState(false)
    const isLoading = useSelector(state => state.video.isLoading)
    const error = useSelector(state => state.video.error)


    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    useEffect( () =>{
        dispatch(getVideos())
    }, [params.page, params.sortOption, params.reverse])

    return (
        <div style={{position: "relative"}}>
            <AdminNavbar/>
                <div className="wide main">
                    <h2 className="title">Videos</h2>
                    <SortAndSearch
                        params={params}
                        onParamsChange={value => dispatch(setParams(value))}
                        action={getVideos}
                        sortList={sortList}
                        isLoading={isLoading}
                    />
                    <MyTable
                        title="video"
                        items={videos}
                        remove={removeVideo}
                        updateClick={(video) => {
                            dispatch(setVideo(video))
                            setModal(true)
                        }}
                        iconChildren={ (url, video) =>
                            <Tooltip title="Video" placement="bottom">
                                <IconButton aria-label="show video" onClick={() => {
                                    dispatch(setVideo(video))
                                    setViewModal(true)
                                }}>
                                    <CameraAltOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                        }
                    />
                    <MyPagination page={params.page} pageSize={params.take} pageCount={videos.length}
                    totalCount={totalCount} changePage={changePage}/>
                    {modal && <MyModal visible={modal} setVisible={setModal}>
                        <VideoForm
                            action={() => {
                                dispatch(updateVideo(setModal))
                            }}
                            title="Update video"
                            submitTitle="Save"
                            setVisible={setModal}
                            isModified={true}
                        />
                    </MyModal>
                    }
                    {viewModal && <MyModal visible={viewModal} setVisible={setViewModal}>
                        <MyPlayer video={video}/>
                    </MyModal>
                    }
                </div>
        </div>
    );
};

export default AdminVideos;