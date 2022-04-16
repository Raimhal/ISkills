import React, {useEffect, useState} from 'react';
import CourseService from "../API/CourseService";
import {useParams} from "react-router-dom";
import {useFetching} from "../hooks/useFetching";
import MyRating from "../components/UI/rating/MyRating";
import "../styles/App.css"
import "../styles/Course.css"
import "../styles/User.css"
import CommentService from "../API/CommentService";
import MyPagination from "../components/UI/pagination/MyPagination";
import defaultCourseImage from '../assets/images/defaultCourseImage.png'
import languageImage from '../assets/images/language.png'
import MyEditor from "../components/UI/editor/MyEditor";
import {token} from "../router/token";
import CommentForm from "../components/comment/CommentForm";

import CommentList from "../components/comment/CommentList";
import MyButton from "../components/UI/button/MyButton";
import MyModal from "../components/UI/MyModal/MyModal";
import CourseForm from "../components/course/CourseForm";

const CoursePage = ({route, navigation}) => {

    const {id} = useParams()

    const [course, setCourse] = useState({
        theme: {
            title: ''
        },
        comments: []
    })

    const initialParamsState = {
        skip: 0,
        take: 10,
        reverse: true,
        sortOption: 'date'
    }

    const [params, setParams] = useState(initialParamsState)

    const [page, setPage] = useState(1)

    const [comments, setComments] = useState([])

    const [totalCount, setTotalCount] = useState(0)

    const [modal, setModal] = useState(false)

    const [getCourse, isCourseLoading, courseError] = useFetching(async (id) =>{
        const course = await CourseService.getOne(id)
        setCourse(course)
    })

    const [getComments, isCommentsLoading, commentsError] = useFetching( async (courseId) => {
        const [count, newComments] = await CommentService.Get(courseId, {
            params: {
                ...params,
                skip: (page - 1) * params.take,
            }
        })
        setComments([...newComments])
        setTotalCount(count)
    })

    const createComment = async (comment) => {
        const commentId = await CommentService.Create({...comment, courseId: id}, {
            headers: {
                Authorization: token
            }
        })
        setTotalCount(totalCount + 1)
    }

    const updateCourse = async (course) => {
        await CourseService.Update(course, {
            headers: {
                Authorization: token
            }
        })
    }

    useEffect(() => {
        getCourse(id)
    }, [])

    useEffect(() => {
        getComments(id)
    }, [page, totalCount])

    const changePage = (page) => {
        setPage(page)
    }

    return (
        <div className="main">
            {!isCourseLoading
                ? <div className="course__page">
                    <div className="card">
                        <div className="head">
                            <h3>{course.title}</h3>
                            <MyEditor defaultValue={course.shortInfo} readonly/>
                            <div className="language">
                                <img src={languageImage} alt="language : " style={{width: 16}}/>
                                <span>{course.language}</span>
                            </div>
                            <div>Created: {new Date(course.dateCreated).toLocaleDateString()}</div>
                            {course.dateUpdated <= course.dateCreated &&
                                <div>Last updated : {new Date(course.dateUpdated).toDateString()}</div>
                            }
                            <MyRating value={course.rating} readonly/>
                            <div>{course.theme.title}</div>
                        </div>
                        <div className="body">
                            <img src={course.imageUrl || defaultCourseImage} alt="course image" className="course__image"/>
                            {course.price === null
                                ? <div className="free">
                                    <MyButton >Get for free</MyButton>
                                </div>
                                : <div className="buy">
                                    <div>{course.price} $</div>
                                    <MyButton>Buy now</MyButton>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="block">
                        <h4>Description :</h4>
                        <MyEditor defaultValue={course.description} readonly/>
                    </div>
                    <div className="block">
                        <h4>Requirements :</h4>
                        <MyEditor defaultValue={course.requirements} readonly />
                    </div>
                    <div>
                        <MyButton onClick={() => setModal(true)}>Update</MyButton>
                        <MyModal visible={modal} setVisible={setModal}>
                            <CourseForm action={updateCourse} title="Create" defaultState={course}/>
                        </MyModal>
                    </div>
                    {!isCommentsLoading &&
                        <div>
                            <CommentForm action={createComment} title="Create" className='block'/>
                            <h4>{totalCount} comments :</h4>
                            {comments.length > 0 &&
                            <div>
                                <MyPagination page={page} pageSize={params.take} pageCount={comments.length} totalCount={totalCount}
                                              changePage={changePage}/>
                                <CommentList comments={comments}/>
                                <MyPagination page={page} pageSize={params.take} pageCount={comments.length} totalCount={totalCount}
                                              changePage={changePage}/>
                            </div>
                            }
                        </div>
                    }
                </div>
                : <p>Loading...</p>
            }
        </div>
    );
};

export default CoursePage;