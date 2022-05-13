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
import CommentForm from "../components/comment/CommentForm";

import CommentList from "../components/comment/CommentList";
import MyButton from "../components/UI/button/MyButton";
import MyModal from "../components/UI/MyModal/MyModal";
import CourseForm from "../components/course/CourseForm";
import {useDispatch, useSelector} from "react-redux";
import {clearCourse, setCourse, updateCourse, updateImage} from "../store/CourseReducer";
import {clearComments, setComments} from "../store/CommentReducer";
import UserService from "../API/UserService";
import {clearUsers, setUser, setUsers} from "../store/UserReducer";
import MyTextarea from "../components/UI/textarea/MyTextarea";
import ChapterService from "../API/ChapterService";
import {clearChapter, clearChapters, setChapters} from "../store/ChapterReducer";
import ChapterList from "../components/chapter/ChapterList";
import ChapterForm from "../components/chapter/ChapterForm";
import '../styles/Chapter.css'
import VideoForm from "../components/video/VideoForm";
import VideoService from "../API/VideoService";
import ImageUpload from "../components/UI/Upload/ImageUpload";
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import {Tooltip} from "@material-ui/core";
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from '@mui/icons-material/AddBox';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import Loading from "../components/UI/Loading/Loading";
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';

const CoursePage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const course = useSelector(state => state.course.course)
    const comments = useSelector(state => state.comment.comments)
    const students = useSelector(state => state.user.users)
    const chapters = useSelector(state => state.chapter.chapters)
    const currentUser = useSelector(state => state.user.user)
    const isAdmin = useSelector(state => state.user.isAdmin)
    const isAuth = useSelector(state => state.user.isAuth)

    const hasAccess = course.creatorId === currentUser.id || isAdmin
    const hasUserAccess = ( hasAccess || currentUser.courses?.some(x => x.id === course.id)) && isAuth

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
    const [modalChapterUpdate, setChapterUpdateModal] = useState(false)
    const [videoModal, setVideoModal] = useState(false)
    const [videoUpdateModal, setVideoUpdateModal] = useState(false)
    const [imageModal, setImageModal] = useState(false)

    const [getCourse, isCourseLoading, courseError] = useFetching(async (id) =>{
        const _course = await CourseService.GetCourse(id)

        dispatch(setCourse({...course, ..._course}))
    })

    const [getCurrentUser, isUserLoading, userError] = useFetching(async () =>{
        const user = await UserService.getCurrentUser()
        dispatch(setUser(user))
    })

    const [getComments, isCommentsLoading, commentsError] = useFetching( async (courseId) => {
        const [count, newComments] = await CommentService.GetComments({
            params: {
                ...params,
                skip: (page - 1) * params.take,
                courseId: courseId
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
        const [count, newChapters] = await ChapterService.GetChapters({
            params: {
                ...params,
                reverse: false,
                sortOption: "title",
                skip: (chapterPage - 1) * params.take,
                courseId: courseId
            }
        })
        dispatch(setChapters([...newChapters]))
        setChapterTotalCount(count)
    })

    const update = async () => {
        dispatch(updateCourse())
        setModal(false)
    }

    const assignUser = async (id) => {
        if(!isAuth){
            navigate('/login')
            return
        }

        await CourseService.ToggleAssignment(id)
        dispatch(setUsers([...students, currentUser]))
        dispatch(setUser({...currentUser, courses: [...currentUser.courses, course]}))
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

    const createChapter = async (chapter) => {
        const chapterId = await ChapterService.Create({...chapter, courseId: id})
        dispatch(setChapters([...chapters, {...chapter, id: chapterId, creatorId: currentUser.id, courseId: id}]))
        setChapterTotalCount(+totalChapterCount + 1)
        setChapterModal(false)
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
        await ChapterService.Delete(id)
        dispatch(setChapters(chapters.filter(c => c.id !== id)))
    }

    const createVideo = async (video) => {
        video.file = document.querySelector("#file").files[0]
        const index = chapters.findIndex(x => x.id === video.chapterId)
        const videoId = await VideoService.Create(video, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        const newVideo = await VideoService.GetVideo(videoId)
        setVideoModal(false)
        courses[index].videos.push(newVideo)
        dispatch(setChapters([...chapters]))
    }

    const updateVideo = async (video) => {
        video.file = document.querySelector("#file").files[0]
        const index = chapters.findIndex(x => x.id === video.chapterId)
        await VideoService.Update(video, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        const updatedVideo = await VideoService.GetVideo(video.id)
        const videoIndex = chapters[index].videos.findIndex(x => x.id === video.id)
        console.log(chapters[index].videos)
        chapters[index].videos[videoIndex] = updatedVideo
        dispatch(setChapters([...chapters]))
        setVideoUpdateModal(false)
    }


    const removeVideo = async (video) => {
        await VideoService.Delete(video.id)
        const index = chapters.findIndex(x => x.id === video.chapterId)
        chapters[index].videos = chapters[index].videos.filter(x => x.id !== video.id)
        chapters[index].videosCount -= 1
        dispatch(setChapters([...chapters]))
    }

    useEffect(() => {
        getCourse(id)
        getCurrentUser()
        return () => {
            dispatch(clearCourse())
            dispatch(clearComments())
            dispatch(clearUsers())
            dispatch(clearChapters())
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
                        <div className="head block">
                            <h3>{course.title}</h3>
                            <div>
                                {course.shortInfo}
                            </div>
                            <div className="block absolute__form" style={{width: "fit-content", float: "right", margin: "1rem", position: "absolute"}}>
                                <img
                                    src={course.imageUrl || defaultCourseImage}
                                    alt="course image"
                                    className="course__image"
                                    onClick={() => hasAccess && setImageModal(true)}
                                    style={{cursor: hasAccess && "pointer" }}
                                />
                                <div className="language">
                                    <img src={languageImage} alt="language : " style={{width: 16}}/>
                                    <div>{course.language}</div>
                                </div>
                                <div>Created: {new Date(course.dateCreated).toLocaleDateString()}</div>
                                {course.dateUpdated <= course.dateCreated &&
                                <div>Last updated : {new Date(course.dateUpdated).toDateString()}</div>
                                }
                                <MyRating value={course.rating} readonly/>
                                <div>{course.theme?.title}</div>
                                {totalChapterCount > 0 && <div>{totalChapterCount} chapters</div>}
                                {!hasUserAccess &&
                                <div>
                                    {course.price === 0
                                        ? <div className="price">
                                            <div> Free </div>
                                            <MyButton onClick={() => assignUser(course.id)}>Get</MyButton>
                                        </div>
                                        : <div className="price">
                                            <div>{course.price} $</div>
                                            <MyButton onClick={() =>
                                                // redirect to payment page
                                                assignUser(course.id)
                                            }>Buy now</MyButton>
                                        </div>
                                    }
                                </div>
                                }
                                { hasAccess &&
                                <div>
                                    <Tooltip title="Edit" placement="bottom">
                                        <IconButton aria-label="edit" onClick={() => setModal(true)}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Update image" placement="bottom">
                                        <IconButton aria-label="update image" onClick={() => setImageModal(true)}>
                                            <CameraAltOutlinedIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                    { !isStudentsLoading && students.length > 0 &&
                        <div className="block">
                            <h4>Students : </h4>
                            <div className="user__list">
                                {students.map(student =>
                                    <img src={student.src || defaultUserImage} alt="student" className="user__image" key={student.id}/>
                                )}
                            </div>
                            <MyPagination page={userPage} pageSize={params.take} pageCount={students.length} totalCount={totalUserCount}
                                          changePage={page => setUserPage(page)}/>
                        </div>
                    }
                    {course.description && course.description.trim() !== '<p></p>' &&
                    <div className="block">
                        <h4>Description :</h4>
                        <MyTextarea value={course.description}/>
                    </div>
                    }
                    {course.requirements && course.requirements.trim() !== '<p></p>' &&
                    <div className="block">
                        <h4>Requirements :</h4>
                        <MyTextarea value={course.requirements}/>
                    </div>
                    }
                    { hasAccess &&
                        <div>
                            {modal && <MyModal visible={modal} setVisible={setModal}>
                                <CourseForm action={update} title="Save"/>
                            </MyModal>
                            }
                            {imageModal && <MyModal visible={imageModal} setVisible={setImageModal}>
                                <ImageUpload
                                    action={() => {
                                        dispatch(updateImage())
                                        setImageModal(false)
                                    }}
                                    title="Update image"
                                    submitTitle="Save"
                                    setVisible={setImageModal}
                                />
                            </MyModal>
                            }
                        </div>
                    }
                    {(chapters.length > 0 || hasAccess)&&
                    <div className="block">
                        <div className="chapter__title">
                            <h4>{totalChapterCount} chapters :</h4>
                            {(currentUser.id === course.creatorId || isAdmin) &&
                            <div>
                                <Tooltip title="Add chapter" placement="bottom">
                                    <IconButton aria-label="add chapter" onClick={() => setChapterModal(true)}>
                                        <AddBoxIcon />
                                    </IconButton>
                                </Tooltip>
                                {modalChapter && <MyModal visible={modalChapter} setVisible={setChapterModal}>
                                    <ChapterForm action={createChapter} title="Create"/>
                                </MyModal>}
                                <Tooltip title="Add video" placement="bottom">
                                    <IconButton aria-label="add video" onClick={() => setVideoModal(true)}>
                                        <VideoLibraryIcon />
                                    </IconButton>
                                </Tooltip>
                                {videoModal && <MyModal visible={videoModal} setVisible={setVideoModal}>
                                    <VideoForm
                                        action={createVideo}
                                        title="Add video"
                                        submitTitle="Add"
                                        setVisible={setVideoModal}
                                    />
                                </MyModal>
                                }
                                {videoUpdateModal && <MyModal visible={videoUpdateModal} setVisible={setVideoUpdateModal}>
                                    <VideoForm
                                        action={updateVideo}
                                        title="Update video"
                                        submitTitle="Save"
                                        setVisible={setVideoUpdateModal}
                                    />
                                </MyModal>
                                }
                                {modalChapterUpdate && <MyModal visible={modalChapterUpdate} setVisible={setChapterUpdateModal}>
                                    <ChapterForm action={updateChapter} title="Save"/>
                                </MyModal>}
                            </div>
                            }
                        </div>
                        {chapters.length > 0 &&
                        <div>
                            <MyPagination page={chapterPage} pageSize={params.take} pageCount={chapters.length}
                                          totalCount={totalChapterCount}
                                          changePage={page => setChapterPage(page)}/>
                            <ChapterList
                                chapters={chapters}
                                update={() => setChapterUpdateModal(true)}
                                updateVideo={() => setVideoUpdateModal(true)}
                                remove={removeChapter}
                                removeVideo={removeVideo}
                                userId={currentUser.id}
                                isAdmin={isAdmin}
                            />
                            <MyPagination page={chapterPage} pageSize={params.take} pageCount={chapters.length}
                                          totalCount={totalChapterCount}
                                          changePage={page => setChapterPage(page)}/>
                        </div>
                        }
                    </div>
                    }
                    { hasUserAccess &&
                        <CommentForm action={createComment} title="Create" className='block'/>
                    }
                    {comments.length > 0 &&
                        <div>
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
                : <Loading />
            }
        </div>
    );
};

export default CoursePage;