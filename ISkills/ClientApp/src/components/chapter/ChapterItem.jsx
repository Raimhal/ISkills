import React, {useEffect, useState} from 'react';
import '../../styles/Chapter.css'
import '../../styles/Button.css'
import MyTextarea from "../UI/textarea/MyTextarea";
import {useDispatch, useSelector} from "react-redux";
import {setChapter} from "../../store/ChapterReducer";
import MyModal from "../UI/MyModal/MyModal";
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import {Tooltip} from '@material-ui/core';
import {getVideos, setVideo} from "../../store/VideoReducer";
import MyPlayer from "../video/MyPlayer";
import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";


const ChapterItem = ({chapter, remove, update, userId, isAdmin, updateVideo, removeVideo}) => {
    const dispatch = useDispatch()
    const chapters = useSelector(state => state.chapter.chapters)
    const course = useSelector(state => state.course.course)
    const storageVideo = useSelector(state => state.video.video)
    const isAuth = useSelector(state => state.user.isAuth)
    const hasAccess = (userId === course.creatorId || isAdmin) && isAuth
    const [viewModal, setViewModal] = useState(false)

    const removeHandleClick = (e) => {
        e.stopPropagation()
        dispatch(remove(chapter.id))
    }

    const handleUpdateClick = (e) => {
        e.stopPropagation()
        dispatch(setChapter(chapter))
        update()
    }

    const removeVideoHandleClick = (e, video)=> {
        e.stopPropagation()
        dispatch(removeVideo(video.id))
    }

    const handleVideoUpdateClick = (e, video)=> {
        e.stopPropagation()
        dispatch(setVideo(video))
        updateVideo()
    }

    useEffect(() => {
        dispatch(getVideos(chapter.id))
    }, [])

    return (
        <div className="chapter">
            <div className="tab">
                <input id={`tab-${chapter.id}`} type="checkbox" name="tabs" />
                <label htmlFor={`tab-${chapter.id}`}>{chapter.title}</label>
                <div className="tab-content">
                    <MyTextarea value={chapter.description}/>
                    {chapter.videosCount > 0 &&
                    <div>
                        {chapter?.videos?.map(video =>
                            <div
                                key={video.id}
                                className="block"
                                style={{
                                    margin: "0.6rem",
                                    padding: "0",
                                    marginLeft: "1rem",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    cursor: "pointer"
                                }}
                                onClick={() => {
                                    dispatch(setVideo(video))
                                    setViewModal(true)
                                }}
                            >
                                <div className="title">
                                    <SlowMotionVideoIcon />
                                    <p>{video.title}</p>
                                </div>
                                {hasAccess &&
                                <div>
                                    <IconButton aria-label="update" onClick={(e) => handleVideoUpdateClick(e, video)}>
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton aria-label="delete" onClick={(e) => removeVideoHandleClick(e, video)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </div>
                                }
                            </div>
                        )}
                        {viewModal &&
                            <MyModal visible={viewModal} setVisible={setViewModal}>
                                <MyPlayer video={storageVideo}/>
                            </MyModal>
                        }
                    </div>
                    }
                    {hasAccess &&
                    <div className="chapter__btns">
                        <Tooltip title="Update">
                            <IconButton aria-label="update" onClick={handleUpdateClick}>
                                <EditIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton aria-label="delete" onClick={removeHandleClick}>
                                <DeleteIcon/>
                            </IconButton>
                        </Tooltip>
                    </div>
                    }
                </div>
            </div>
        </div>
    )
};

export default ChapterItem;