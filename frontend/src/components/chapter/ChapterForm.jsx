import React, {useEffect, useState} from 'react';
import MyInput from "../UI/input/MyInput";
import MyButton from "../UI/button/MyButton";
import MySelect from "../UI/select/MySelect";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import MyEditor from "../UI/editor/MyEditor";
import {useDispatch, useSelector} from "react-redux";
import {clearChapter, setChapter} from "../../store/ChapterReducer";
import CategoryService from "../../API/CategoryService";
import {useFetching} from "../../hooks/useFetching";
import ChapterService from "../../API/ChapterService";
import ThemeService from "../../API/ThemeService";
import {setCategories} from "../../store/CategoryReducer";
import {setThemes} from "../../store/ThemeReducer";
import {setCourse} from "../../store/CourseReducer";

const ChapterForm = ({action, title, ...props}) => {
    const chapter = useSelector(state => state.chapter.chapter)
    const dispatch = useDispatch()

    const chapterAction = (e) => {
        e.preventDefault()
        console.log(chapter)
        action(chapter)
    }

    return (
        <form className="form" onSubmit={chapterAction}>
            <div className="block">
                Title :
                <MyInput type="text" defaultValue={chapter.title} onChange={e => dispatch(setChapter({...chapter, title: e.target.value}))}/>
            </div>
            <div className="block">
                Description :
                <MyEditor defaultValue={chapter.description} onChange={value => dispatch(setChapter({...chapter, description: value}))}/>
            </div>
            <MyButton>{title}</MyButton>
        </form>
    );
};

export default ChapterForm;