import React, {useEffect, useState} from 'react';
import CourseService from "../API/CourseService";
import {useNavigate, useParams} from "react-router-dom";
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
import {clearCourse, setCourse} from "../store/CourseReducer";
import {clearComment, clearComments, setComments} from "../store/CommentReducer";
import UserService from "../API/UserService";
import {clearUsers, setUser, setUsers} from "../store/UserReducer";
import ReactHtmlParser from "react-html-parser";
import MyTextarea from "../components/UI/textarea/MyTextarea";
import ChapterService from "../API/ChapterService";
import {setChapters} from "../store/ChapterReducer";
import ChapterList from "../components/chapter/ChapterList";
import ChapterForm from "../components/chapter/ChapterForm";

const CoursePage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const course = useSelector((state) => state.course.course)
    const comments = useSelector((state) => state.comment.comments)
    const students = useSelector((state) => state.user.users)
    const chapters = useSelector((state) => state.chapter.chapters)
    const currentUser = useSelector(state => state.user.user)
    const isAdmin = useSelector(state => state.user.isAdmin)

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
    const [chapterPage, setChapterPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [totalUserCount, setUserTotalCount] = useState(0)
    const [totalChapterCount, setChapterTotalCount] = useState(0)
    const [modal, setModal] = useState(false)
    const [modalComment, setCommentModal] = useState(false)
    const [modalChapter, setChapterModal] = useState(false)

    const [getCourse, isCourseLoading, courseError] = useFetching(async (id) =>{
        const _course = await CourseService.GetCourse(id)

        dispatch(setCourse({...course, ..._course}))
    })

    const [getCurrentUser, isUserLoading, userError] = useFetching(async () =>{
        const user = await UserService.getCurrentUser()
        dispatch(setUser(user))
    })

    const [getComments, isCommentsLoading, commentsError] = useFetching( async (courseId) => {
        const [count, newComments] = await CommentService.GetCourseComments(courseId, {
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
                skip: (userPage - 1) * params.take,
            }
        })
        dispatch(setUsers(newStudents))
        setUserTotalCount(count)
    })

    const [getChapters, isChaptersLoading, chaptersError] = useFetching( async (courseId) => {
        const [count, newChapters] = await ChapterService.GetCourseChapters(courseId, {
            params: {
                ...params,
                reverse: false,
                sortOption: 'title',
                skip: (chapterPage - 1) * params.take,
            }
        })
        dispatch(setChapters(newChapters))
        setChapterTotalCount(count)
    })

    const updateCourse = async (course) => {
        await CourseService.Update(course.id, course)
    }

    const assignUser = async (id) => {
        await CourseService.ToggleAssignment(id)
        dispatch(setUsers([...students, currentUser]))
    }

    const createComment = async (comment) => {
        const commentId = await CommentService.Create({...comment, courseId: id})
        const date = new Date()
        const newComment = {...comment, id: commentId, creator: currentUser, date: date, dateUpdated: date}
        dispatch(setComments([newComment, ...comments]))
        const newRating = ((course.rating * +totalCount + comment.rating) / (+totalCount + 1))
        dispatch(setCourse({...course, rating: newRating }))
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

    const removeComment = async (id) => {
        const comment = comments.find(c => c.id === id)
        const newRating = ((course.rating * +totalCount - comment.rating) / (+totalCount - 1))
        dispatch(setCourse({...course, rating: newRating }))
        await CommentService.Delete(id)
        dispatch(setComments(comments.filter(c => c.id !== id)))
    }

    const createChapter = async (chapter) => {
        const chapterId = await ChapterService.Create({...chapter, courseId: id})
        const newChapter = {...chapterId, id: chapterId}
        dispatch(setChapters([...chapters, newChapter]))
        setChapterTotalCount(+totalChapterCount + 1)
    }

    const updateChapter = async (chapter) => {
        await ChapterService.Update(chapter.id, chapter)
        dispatch(setChapters([...chapters.map(c => {
            if(c.id === chapter.id) {
                return chapter
            }
            return c
        })]))
        setChapterModal(false)
    }

    const removeChapter = async (id) => {
        await CommentService.Delete(id)
        dispatch(setChapters(chapters.filter(c => c.id !== id)))
    }

    useEffect(() => {
        getCourse(id)
        getCurrentUser()
        return () => {
            dispatch(clearCourse())
            dispatch(clearComments())
            dispatch(clearUsers())
        }
    }, [])

    useEffect(() => {
        getComments(id)
    }, [page])

    useEffect( () => {
        getStudents(id)
    }, [userPage])

    useEffect(() => {
        getChapters(id)
    }, [chapterPage])

    const changePage = (page) => {
        setPage(page)
    }

    return (
        <div className="main">
            {courseError && navigate('/404')}
            {!isCourseLoading
                ? <div className="course__page">
                    <div className="card">
                        <div className="head">
                            <h3>{course.title}</h3>
                            <MyTextarea value={course.shortInfo}/>
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
                            {!students.some(x => x.id === currentUser.id) &&
                                <div>
                                {course.price === 0
                                    ? <div className="free">
                                    <MyButton onClick={() => assignUser(course.id)}>Get for free</MyButton>
                                    </div>
                                    : <div className="buy">
                                    <div>{course.price} $</div>
                                    <MyButton>Buy now</MyButton>
                                    </div>
                                }
                                </div>
                            }
                        </div>
                    </div>
                    { !isStudentsLoading && students.length > 0 &&
                        <div className="block">
                            <h4>Students : </h4>
                            {students.map(student =>
                                <div key={student.id}>
                                    <img src={student.src || defaultUserImage} alt="student" className="user__image"/>
                                </div>
                            )}
                            <MyPagination page={userPage} pageSize={params.take} pageCount={students.length} totalCount={totalUserCount}
                                          changePage={page => setUserPage(page)}/>
                        </div>
                    }
                    {course.description &&
                    <div className="block">
                        <h4>Description :</h4>
                        <MyTextarea value={course.description}/>
                    </div>
                    }
                    {course.requirements &&
                    <div className="block">
                        <h4>Requirements :</h4>
                        <MyTextarea value={course.requirements}/>
                    </div>
                    }
                    <div>
                        <MyButton onClick={() => setModal(true)}>Update</MyButton>
                        {modal && <MyModal visible={modal} setVisible={setModal}>
                            <CourseForm action={value => {
                                updateCourse(value)
                                setModal(false)
                            }} title="Save" defaultState={course}/>
                        </MyModal>
                        }
                    </div>
                    {chapters.length > 0 &&
                    <div className="block">
                        <ChapterForm action={createChapter} title="Create" className='block'/>
                        <h4>{totalChapterCount} chapters :</h4>
                        {chapters.length > 0 &&
                        <div>
                            <MyPagination page={chapterPage} pageSize={params.take} pageCount={chapters.length} totalCount={totalChapterCount}
                                          changePage={page => setChapterPage(page)}/>
                            <ChapterList chapters={chapters} update={() => setChapterModal(true)} remove={removeChapter}/>
                            <MyPagination page={chapterPage} pageSize={params.take} pageCount={chapters.length} totalCount={totalChapterCount}
                                          changePage={page => setChapterPage(page)}/>
                        </div>
                        }
                        {modalChapter && <MyModal visible={modalChapter} setVisible={setChapterModal}>
                            <ChapterForm action={updateChapter} title="Save"/>
                        </MyModal>
                        }
                    </div>
                    }
                    {comments.length > 0 &&
                        <div>
                            <CommentForm action={createComment} title="Create" className='block'/>
                            <h4>{totalCount} comments :</h4>
                            {comments.length > 0 &&
                                <div>
                                    <MyPagination page={page} pageSize={params.take} pageCount={comments.length} totalCount={totalCount}
                                                  changePage={changePage}/>
                                    <CommentList
                                        comments={comments}
                                        update={() => setCommentModal(true)}
                                        remove={removeComment}
                                        userId={currentUser.id}
                                        isAdmin={isAdmin}
                                    />
                                    <MyPagination page={page} pageSize={params.take} pageCount={comments.length} totalCount={totalCount}
                                                  changePage={changePage}/>
                                </div>
                            }
                            {modalComment && <MyModal visible={modalComment} setVisible={setCommentModal}>
                                <CommentForm action={updateComment} title="Save"/>
                            </MyModal>
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