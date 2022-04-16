import React from 'react';
import CourseItem from "./CourseItem";
import '../../styles/App.css'
import {CSSTransition, TransitionGroup} from "react-transition-group";

const CourseList = ({courses, title, remove}) => {
    return (
        <div>
            <h2 style={{padding: "5px"}}>{title}</h2>
            {courses?.length === 0
                ? <div>No courses found</div>
                : <TransitionGroup className="courses">
                    {courses.map(course =>
                        <CSSTransition
                            key={course.id}
                            timeout={500}
                            classNames="course"
                        >
                            <CourseItem course={course} remove={remove} />
                        </CSSTransition>
                    )}
                </TransitionGroup>
            }
        </div>
    );
};

export default CourseList;