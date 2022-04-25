import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import '../../styles/Chapter.css'
import '../../styles/Button.css'
import MyTextarea from "../UI/textarea/MyTextarea";
import {useFetching} from "../../hooks/useFetching";
import VideoService from "../../API/VideoService";


const ChapterItem = ({chapter, remove}) => {
    const navigate = useNavigate();
    const [videos, setVideos] = useState([])

    const removeHandleClick = (e) => {
        e.stopPropagation()
        remove(chapter.id)
    }

    const [getVideos, isVideosLoading, videosError] = useFetching( async (chapterId) => {
        const [count, videos] = await VideoService.GetChapterVideos(chapterId)
        setVideos(videos)
    })

    useEffect(() => {
        getVideos(chapter.id)
    }, [])
    return (
        <div className="tab">
            <input id={`tab-${chapter.id}`} type="checkbox" name="tabs" />
                <label htmlFor={`tab-${chapter.id}`}>{chapter.title}</label>
                <div className="tab-content">
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
    )
};

export default ChapterItem;