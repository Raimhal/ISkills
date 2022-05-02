import React, {useState} from 'react';
import MyInput from "../UI/input/MyInput";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {useDispatch, useSelector} from "react-redux";
import {clearVideo, setVideo} from "../../store/VideoReducer";
import MyButton from "../UI/button/MyButton";
import MySelect from "../UI/select/MySelect";

const VideoForm = ({action, title, submitTitle, ...props}) => {
    const dispatch = useDispatch()
    const video = useSelector(state => state.video.video)
    const chapters = useSelector(state => state.chapter.chapters)

    const videoAction = (e) => {
        e.preventDefault()
        action(video)
        console.log('done')
        dispatch(clearVideo())
    }

    return (
        <form className="form" onSubmit={videoAction}>
            <MyInput defaultValue={video.title} onChange={e => dispatch(setVideo({...video, title: e.target.value}))} label="title"/>
            <MySelect
                value={video.chapterId || ""}
                onChange={value => dispatch(setVideo({...video, chapterId: value}))}
                defaultValue="Chapter"
                options={chapters.map(c => ({name: c.title, value: c.id}))}
            />
            <input type="file" onChange={e => dispatch(setVideo({...video, file: e.target.files[0]}))}/>
            <MyButton>{submitTitle}</MyButton>
        </form>
    );
};

export default VideoForm;