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
import defaultUserImage from '../assets/images/defaultUserImage.png'
import languageImage from '../assets/images/language.png'
import MyEditor from "../components/UI/editor/MyEditor";
import CommentForm from "../components/comment/CommentForm";

import CommentList from "../components/comment/CommentList";
import MyButton from "../components/UI/button/MyButton";
import MyModal from "../components/UI/MyModal/MyModal";
import CourseForm from "../components/course/CourseForm";
import {useDispatch, useSelector} from "react-redux";
import {setCourse} from "../store/CourseReducer";
import {clearComment, setComments} from "../store/CommentReducer";
import UserService from "../API/UserService";
import {setUsers} from "../store/UserReducer";
import ReactHtmlParser from "react-html-parser";

const CoursePage = () => {
    const dispatch = useDispatch()
    const course = useSelector((state) => state.course.course)
    const comments = useSelector((state) => state.comment.comments)
    const students = useSelector((state) => state.user.users)

    const {id} = useParams()
    const initialParamsState = {
        skip: 0,
        take: 10,
        reverse: true,
        sortOption: 'date'
    }

    const [params, setParams] = useState(initialParamsState)

    const [page, setPage] = useState(1)
    const [userPage, setUserPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [totalUserCount, setUserTotalCount] = useState(0)
    const [modal, setModal] = useState(false)
    const [modalComment, setCommentModal] = useState(false)

    const [getCourse, isCourseLoading, courseError] = useFetching(async (id) =>{
        const course = await CourseService.getOne(id)
        dispatch(setCourse(course))
    })

    const [getComments, isCommentsLoading, commentsError] = useFetching( async (courseId) => {
        const [count, newComments] = await CommentService.Get(courseId, {
            params: {
                ...params,
                skip: (page - 1) * params.take,
            }
        })
        dispatch(setComments(newComments))
        setTotalCount(count)
    })

    const [getStudents, isStudentsLoading, studentsError] = useFetching( async (courseId) => {
        const [count, newStudents] = await UserService.getCourseStudents(courseId, {
            params: {
                ...params,
                reverse: false,
                sortOption: 'username',
                skip: (page - 1) * params.take,
            }
        })
        dispatch(setUsers(newStudents))
        setUserTotalCount(count)
    })

    const createComment = async (comment) => {
        const commentId = await CommentService.Create({...comment, courseId: id})
        const newComment = await CommentService.getOne(commentId)
        console.log(newComment)
        dispatch(setComments([newComment, ...comments]))
        setTotalCount(+totalCount + 1)
    }

    const updateComment = async (comment) => {
        await CommentService.Update(comment.id, comment)
        dispatch(setComments([...comments.map(c => {
            if(c.id === comment.id) {
                console.log(comment)
                return comment
            }
            return c
        })]))
        setCommentModal(false)
    }

    const updateCourse = async (course) => {
        await CourseService.Update(course.id, course)
    }

    const removeComment = async (id) => {
        console.log(id)
        await CommentService.Delete(id)
        dispatch(setComments(comments.filter(c => c.id !== id)))
    }

    useEffect(() => {
        getCourse(id)
    }, [])

    useEffect(() => {
        getComments(id)
    }, [page])

    useEffect( () => {
        getStudents(id)
    }, [userPage])

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
                            <div>{ReactHtmlParser(course.shortInfo)}</div>
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
                                    <MyButton>Get for free</MyButton>
                                </div>
                                : <div className="buy">
                                    <div>{course.price} $</div>
                                    <MyButton>Buy now</MyButton>
                                </div>
                            }
                        </div>
                    </div>
                    { !isStudentsLoading &&
                        <div className="block">
                            <h4>Students : </h4>
                            {students.map(student =>
                                <div key={student.id}>
                                    <img src={student.src || defaultUserImage} alt="student" className="user__image"/>
                                </div>
                            )}
                        </div>
                    }
                    <div className="block">
                        <h4>Description :</h4>
                        <div>{ReactHtmlParser(course.description)}</div>
                    </div>
                    <div className="block">
                        <h4>Requirements :</h4>
                        <div>{ReactHtmlParser(course.requirements)}</div>
                    </div>
                    <div>
                        <MyButton onClick={() => setModal(true)}>Update</MyButton>
                        <MyModal visible={modal} setVisible={setModal}>
                            <CourseForm action={updateCourse} title="Save" defaultState={course}/>
                        </MyModal>
                    </div>
                    {/*{!isCommentsLoading &&*/}
                        <div>
                            <CommentForm action={createComment} title="Create" className='block'/>
                            <h4>{totalCount} comments :</h4>
                            {comments.length > 0 &&
                                <div>
                                    <MyPagination page={page} pageSize={params.take} pageCount={comments.length} totalCount={totalCount}
                                                  changePage={changePage}/>
                                    <CommentList comments={comments} update={() => setCommentModal(true)} remove={removeComment}/>
                                    <MyPagination page={page} pageSize={params.take} pageCount={comments.length} totalCount={totalCount}
                                                  changePage={changePage}/>
                                </div>
                            }
                            {modalComment && <MyModal visible={modalComment} setVisible={setCommentModal}>
                                <CommentForm action={updateComment} title="Save"/>
                            </MyModal>
                            }
                        </div>
                    {/*}*/}
                </div>
                : <p>Loading...</p>
            }
        </div>
    );
}

export default CoursePage;