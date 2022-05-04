import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import '../../styles/Chapter.css'
import '../../styles/Button.css'
import MyTextarea from "../UI/textarea/MyTextarea";
import {useFetching} from "../../hooks/useFetching";
import VideoService from "../../API/VideoService";
import MyButton from "../UI/button/MyButton";
import {setComment} from "../../store/CommentReducer";
import {useDispatch, useSelector} from "react-redux";
import {setChapter, setChapters} from "../../store/ChapterReducer";
import ChapterService from "../../API/ChapterService";
import MyModal from "../UI/MyModal/MyModal";
import CourseForm from "../course/CourseForm";
import VideoForm from "../video/VideoForm";


const ChapterItem = ({chapter, remove, update, userId, isAdmin}) => {
    const dispatch = useDispatch()
    const chapters = useSelector(state => state.chapter.chapters)
    const [modal, setModal] = useState(false)

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
        const [count, videos] = await VideoService.GetVideos({
            params: {
                chapterId: chapterId
            }
        })
        dispatch(setChapters(chapters.map(c => {
            if(c.id === chapterId)
                return {...c, videos: videos}
            return c
        })))
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
                    {chapter.videos?.length > 0 &&
                    <div>
                        {chapter.videos.map(video =>
                            <div key={video.id} className="block">
                                <p>{video.title}</p>
                                <video preload="true" className="video" controlsList="nodownload" controls >
                                    <source src={video.url} type="video/mp4"/>
                                </video>
                                <div>
                                    <MyButton onClick={handleUpdateClick}>U</MyButton>
                                    <MyButton onClick={removeHandleClick}>X</MyButton>
                                </div>
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