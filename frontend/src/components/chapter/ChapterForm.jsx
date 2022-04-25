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

const ChapterForm = ({action, title, ...props}) => {
    const chapter = useSelector(state => state.chapter.chapter)
    const dispatch = useDispatch()

    const chapterAction = (e) => {
        e.preventDefault()
        console.log(chapter)
        action(chapter)
    }

    return (
        <form className="chapter__form">
            <MyButton onClick={chapterAction}>{title}</MyButton>
        </form>
    );
};

export default ChapterForm;