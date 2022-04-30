import React, {useState} from 'react';
import MyInput from "../UI/input/MyInput";
import MyButton from "../UI/button/MyButton";
import defaultUserImage from "../../assets/images/defaultUserImage.png";
import {useDispatch, useSelector} from "react-redux";
import {setVideo} from "../../store/VideoReducer";
import {setCourse} from "../../store/CourseReducer";

const VideoForm = ({action, title, submitTitle, ...props}) => {
    const video = useSelector(state => state.video.video)
    const dispatch = useDispatch()
    const videoAction = (e) => {
        e.preventDefault()
        action(video)
    }

    return (
        <form className="form" onSubmit={videoAction} {...props}>
            <p>{title}</p>
            <MyInput type="text" defaultValue={video.title} label="Title" onChange={e => dispatch(setVideo({...video, title: e.target.value}))}/>
            <MyInput type="text" defaultValue={video.title} onChange={e => dispatch(setVideo({...video, title: e.target.value}))} label="Title"/>
            <MyInput type="file" defaultValue={video.file} onChange={e => dispatch(setVideo({...video, file: e.target.files[0]}))} label="file"/>
            <MyButton>{submitTitle}</MyButton>
        </form>
    );
};

export default VideoForm;