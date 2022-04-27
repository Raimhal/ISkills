import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import '../../styles/Chapter.css'
import '../../styles/Button.css'
import MyTextarea from "../UI/textarea/MyTextarea";
import {useFetching} from "../../hooks/useFetching";
import VideoService from "../../API/VideoService";
import MyButton from "../UI/button/MyButton";
import {setComment} from "../../store/CommentReducer";
import {useDispatch} from "react-redux";
import {setChapter} from "../../store/ChapterReducer";


const ChapterItem = ({chapter, remove, update, userId, isAdmin}) => {
    const dispatch = useDispatch()
    const [videos, setVideos] = useState([])

    const removeHandleClick = (e) => {
        e.stopPropagation()
        remove(chapter.id)
    }

    const handleUpdateClick = (e) => {
        e.stopPropagation()
        dispatch(setChapter(chapter))
        update()
    }

    const [getVideos, isVideosLoading, videosError] = useFetching( async (chapterId) => {
        const [count, videos] = await VideoService.GetChapterVideos(chapterId)
        setVideos(videos)
    })

    useEffect(() => {
        getVideos(chapter.id)
    }, [])
    return (
        <div className="chapter">
            <div className="tab">
                <input id={`tab-${chapter.id}`} type="checkbox" name="tabs" />
                <label htmlFor={`tab-${chapter.id}`}>{chapter.title}</label>
                <div className="tab-content">
                    {(userId === chapter.creatorId || isAdmin) &&
                    <div className="chapter__btns">
                        <MyButton onClick={handleUpdateClick}>U</MyButton>
                        <MyButton onClick={removeHandleClick}>X</MyButton>
                    </div>
                    }
                    <MyTextarea value={chapter.description}/>
                    {videos.length > 0 &&
                    <div>
                        {videos.map(video =>
                            <div key={video.id}>
                                <div>{video.title}</div>
                                <video preload="true" className="video" controls>
                                    <source src={video.url} type="video/mp4"/>
                                </video>
                            </div>
                        )}
                    </div>
                    }
                </div>
            </div>
        </div>
    )
};

export default ChapterItem;