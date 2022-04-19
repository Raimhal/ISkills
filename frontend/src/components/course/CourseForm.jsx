import React, {useEffect, useState} from 'react';
import MyInput from "../UI/input/MyInput";
import MyButton from "../UI/button/MyButton";
import MySelect from "../UI/select/MySelect";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import MyEditor from "../UI/editor/MyEditor";
import {useDispatch, useSelector} from "react-redux";
import {setCourse} from "../../store/CourseReducer";

const CourseForm = ({action, title, ...props}) => {
    const course = useSelector(state => state.course.course)
    const dispatch = useDispatch()
    const languages = [
        {name: "English", value: "english"},
        {name: "Russian", value: "russian"},
        {name: "Ukrainian", value: "ukrainian"}
    ]

    const categories = [
        {id: 1, title: "other"},
        {id: 2, title: "other 2"},
        {id: 3, title: "other 4"},
    ]

    const themes = [
        {id: 1, title: "other"}
    ]

    const courseAction = (e) => {
        e.preventDefault()
        console.log(course)
        action(course)
    }


    return (
        <form className="course__form">
            <div className="block">
                Title :
                <MyInput type="text" defaultValue={course.title} onChange={e => dispatch(setCourse({...course, title: e.target.value}))}/>
            </div>
            <div className="block">
                Short information :
                <MyEditor defaultValue={course.shortInfo} onChange={value => dispatch(setCourse({...course, shortInfo: value}))}/>
            </div>
            <div className="block">
                Description :
                <MyEditor defaultValue={course.description} onChange={value => dispatch(setCourse({...course, description: value}))}/>
            </div>
            <div className="block">
                Requirements :
                <MyEditor defaultValue={course.requirements} onChange={value => dispatch(setCourse({...course, requirements: value}))}/>
            </div>
            <div className="block">
                <MySelect
                    value={course.language}
                    onChange={value => dispatch(setCourse({...course, language: value}))}
                    defaultValue="Language"
                    options={languages}
                />
                <MySelect
                    value={course.categoryId}
                    onChange={value => dispatch(setCourse({...course, categoryId: +value}))}
                    defaultValue="Category"
                    options={categories.map(c => ({name: c.title, value: c.id.toString()}))}
                />
                <MySelect
                    disabled={course.categoryId === '' }
                    value={course.themeId}
                    onChange={value => dispatch(setCourse({...course, themeId: +value}))}
                    defaultValue="Theme"
                    options={themes.map(c => ({name: c.title, value: c.id}))}
                />
            </div>
            <div className="block">
                <p><input type="radio" name="buyMode" onChange={() => dispatch(setCourse({...course, price: null}))} defaultChecked={course.price === null}/> free to learn</p>
                <p><input type="radio" name="buyMode" onChange={() => dispatch(setCourse({...course, price: 0}))} defaultChecked={course.price !== null}/> buy to learn </p>
                {course.price !== null && <MyInput type="text" value={course.price} onChange={e => dispatch(setCourse({...course, price: e.target.value}))} placeholder="Price"/>}
            </div>
            <MyButton onClick={courseAction}>{title}</MyButton>
        </form>
    );
};

export default CourseForm;