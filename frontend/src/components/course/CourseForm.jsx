import React, {useState} from 'react';
import MyInput from "../UI/input/MyInput";
import MyButton from "../UI/button/MyButton";
import MySelect from "../UI/select/MySelect";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import MyEditor from "../UI/editor/MyEditor";

const CourseForm = ({action, title, defaultState, ...props}) => {
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

    const initialCourseState = {
        title: '',
        shortInfo: '',
        requirements: '',
        description: '',
        language: '',
        price: null,
        imageUrl: "defaultCourseImage.png",
        categoryId: '',
        themeId: ''
    }

    const [course, setCourse] = useState(defaultState || initialCourseState)
    const [buyMode, setBuyMode] = useState(false)

    const courseAction = (e) => {
        e.preventDefault()
        console.log(course)
        action(course)
        setCourse(initialCourseState)
    }

    return (
        <form className="course__form">
            <div className="block">
                Title :
                <MyInput type="text" onChange={e => setCourse({...course, title: e.target.value})}/>
            </div>
            <div className="block">
                Short information :
                <MyEditor onChange={value => setCourse({...course, shortInfo: value})}/>
            </div>
            <div className="block">
                Description :
                <MyEditor onChange={value => setCourse({...course, description: value})}/>
            </div>
            <div className="block">
                Requirements :
                <MyEditor onChange={value => setCourse({...course, requirements: value})}/>
            </div>
            <div className="block">
                <MySelect
                    value={course.language}
                    onChange={value => setCourse({...course, language: value})}
                    defaultValue="Language"
                    options={languages}
                />
                <MySelect
                    value={course.categoryId}
                    onChange={value => setCourse({...course, categoryId: +value})}
                    defaultValue="Category"
                    options={categories.map(c => ({name: c.title, value: c.id.toString()}))}
                />
                <MySelect
                    disabled={course.categoryId === '' }
                    value={course.themeId}
                    onChange={value => setCourse({...course, themeId: +value})}
                    defaultValue="Theme"
                    options={themes.map(c => ({name: c.title, value: c.id}))}
                />
            </div>
            <div className="block">
                <p><input type="radio" name="buyMode" onChange={() => setBuyMode(false)} defaultChecked/> free to learn</p>
                <p><input type="radio" name="buyMode" onChange={() => setBuyMode(true)}/> buy to learn </p>
                {buyMode && <MyInput type="text" onChange={e => setCourse({...course, price: e.target.value})} placeholder="Price"/>}
            </div>
            <MyButton onClick={courseAction}>{title}</MyButton>
        </form>
    );
};

export default CourseForm;