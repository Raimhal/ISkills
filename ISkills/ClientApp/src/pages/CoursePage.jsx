import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import MyRating from "../components/UI/Rating/MyRating";
import "../styles/App.css"
import "../styles/Course.css"
import "../styles/User.css"
import MyPagination from "../components/UI/Pagination/MyPagination";
import defaultCourseImage from '../assets/images/defaultCourseImage.png'
import defaultUserImage from '../assets/images/defaultUserImage.png'
import languageImage from '../assets/images/language.png'
import CommentForm from "../components/comment/CommentForm";

import CommentList from "../components/comment/CommentList";
import MyButton from "../components/UI/Button/MyButton";
import MyModal from "../components/UI/MyModal/MyModal";
import CourseForm from "../components/course/CourseForm";
import {useDispatch, useSelector} from "react-redux";
import {clearCourse, getCourse, setCourse, updateCourse, updateImage} from "../store/CourseReducer";
import {
    clearComment,
    clearComments,
    createComment,
    getComments,
    removeComment,
    setParams as setCommentsParams,
    updateComment
} from "../store/CommentReducer";
import {assignUser, clearUsers, getCurrentUser, getUsers, setParams as setUsersParams} from "../store/UserReducer";
import MyTextarea from "../components/UI/Textarea/MyTextarea";
import {
    clearChapters,
    createChapter,
    getChapters,
    removeChapter,
    setParams as setChaptersParams,
    updateChapter
} from "../store/ChapterReducer";
import ChapterList from "../components/chapter/ChapterList";
import ChapterForm from "../components/chapter/ChapterForm";
import '../styles/Chapter.css'
import VideoForm from "../components/video/VideoForm";
import ImageUpload from "../components/UI/Upload/ImageUpload";
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import {Tooltip} from "@material-ui/core";
import {Fab, IconButton, ThemeProvider} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from '@mui/icons-material/AddBox';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import Loading from "../components/UI/Loading/Loading";
import {createVideo, removeVideo, updateVideo} from "../store/VideoReducer";
import classes from "../components/UI/Navbar/Navbar.module.css";
import AddIcon from "@mui/icons-material/Add";
import {colorTheme} from "../styleThemes";

const CoursePage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const categories = useSelector(state => state.category.categories)
    const course = useSelector(state => state.course.course)
    const comments = useSelector(state => state.comment.comments)
    const students = useSelector(state => state.user.users)
    const chapters = useSelector(state => state.chapter.chapters)
    const currentUser = useSelector(state => state.user.user)
    const isAdmin = useSelector(state => state.user.isAdmin)
    const isAuth = useSelector(state => state.user.isAuth)
    const isImageLoading = useSelector(state => state.course.isImageLoading)
    const isCourseLoading = useSelector(state => state.course.isLoading)

    const hasAccess = (course.creatorId === currentUser.id) || isAdmin
    const hasUserAccess = hasAccess || course.students?.some(x => x.id === currentUser.id)
    const {id} = useParams()

    const commentsParams = useSelector(state => state.comment.params)
    const usersParams = useSelector(state => state.user.params)
    const chaptersParams = useSelector(state => state.chapter.params)

    const error = useSelector(state => state.course.error)

    const totalCommentCount = useSelector(state => state.comment.totalCount)
    const totalStudentCount = useSelector(state => state.user.totalCount)
    const totalChapterCount = useSelector(state => state.chapter.totalCount)

    const isCommentsLoading = useSelector(state => state.comment.isLoading)
    const isStudentsLoading = useSelector(state => state.user.isLoading)
    const isChaptersLoading = useSelector(state => state.chapter.isLoading)

    const [modal, setModal] = useState(false)

    const [modalComment, setCommentModal] = useState(false)
    const [commentUpdateModal, setCommentUpdateModal] = useState(false)

    const [modalChapter, setChapterModal] = useState(false)
    const [modalChapterUpdate, setChapterUpdateModal] = useState(false)

    const [videoModal, setVideoModal] = useState(false)
    const [videoUpdateModal, setVideoUpdateModal] = useState(false)

    const [imageModal, setImageModal] = useState(false)

    useEffect(() => {
        dispatch(getCourse(id, navigate))
        return () => {
            dispatch(clearCourse())
            dispatch(clearComments())
            dispatch(clearUsers())
            dispatch(clearChapters())
        }
    }, [])

    useEffect(() => {
        dispatch(getComments(id))
    }, [commentsParams.page])

    useEffect(() => {
        dispatch(getChapters(id))
    }, [chaptersParams.page])

    const changeCommentsPage = (page) => {
        dispatch(setCommentsParams({...commentsParams, page: page}))
    }

    const changeStudentsPage = (page) => {
        dispatch(setUsersParams({...usersParams, page: page}))
    }

    const changeChaptersPage = (page) => {
        dispatch(setChaptersParams({...chaptersParams, page: page}))
    }

    return (
        <div className="main">
            { !isCourseLoading ?
                <>
            <div className="block">
                <div className="course__head">
                    <img
                        src={course.imageUrl || defaultCourseImage}
                        alt="course image"
                        className="course__image"
                        onClick={() => hasAccess && setImageModal(true)}
                        style={{cursor: hasAccess && "pointer" }}
                    />
                    <div style={{padding: "0.5rem"}}>
                        <h3>{course.title}</h3>
                        <div className="language">
                            <img src={languageImage} alt="language : " style={{width: 16}}/>
                            <div>{course.language}</div>
                        </div>
                        <div>Created: {new Date(course.dateCreated).toLocaleDateString()}</div>
                        {course.dateUpdated <= course.dateCreated &&
                        <div>Last updated: {new Date(course.dateUpdated).toDateString()}</div>
                        }
                        <MyRating value={course.rating} readonly/>
                        <div>Theme: {course.theme?.title}</div>
                        {totalChapterCount > 0 && <div>{totalChapterCount} chapters</div>}
                        {course.students.length > 0 && <div>{course.students.length} students</div>}
                    </div>
                </div>
                {!hasUserAccess &&
                <div>
                    {course.price === 0
                        ? <div className="price">
                            <div> Free </div>
                            <MyButton onClick={() => dispatch(assignUser(navigate))}>Get</MyButton>
                        </div>
                        : <div className="price">
                            <div>{course.price} $</div>
                            <MyButton onClick={ () =>
                                // redirect to payment page
                                dispatch(assignUser(navigate))
                            }>Buy now</MyButton>
                        </div>
                    }
                </div>
                }
                { hasAccess &&
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <Tooltip title="Edit" placement="bottom">
                        <IconButton aria-label="edit" onClick={() => {
                            const category = categories.find(x => x.id === course.theme?.categoryId)
                            dispatch(setCourse({...course, categoryId: category.id}))
                            setModal(true)
                        }}>
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
            <div className="course__page">
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
                            {modal &&
                                <MyModal visible={modal} setVisible={setModal}>
                                    <CourseForm action={async () => {
                                        await dispatch(updateCourse(setModal))
                                    }
                                    } title="Save"/>
                                </MyModal>
                            }
                            {imageModal &&
                                <MyModal visible={imageModal} setVisible={setImageModal}>
                                    <ImageUpload
                                        action={() => {
                                            dispatch(updateImage(setImageModal))
                                        }}
                                        title="Update image"
                                        submitTitle="Save"
                                        setVisible={setImageModal}
                                        isLoading={isImageLoading}
                                        error={error}
                                    />
                                </MyModal>
                            }
                        </div>
                    }
                { course.students.length > 0 &&
                <div className="block">
                    <h4>Students : </h4>
                    <div className="user__list">
                        {course.students?.map(student =>
                            <Tooltip
                                title={student.userName}
                                placement="bottom"
                                key={student.id}
                            >
                                <img
                                    src={student.imageUrl || defaultUserImage}
                                    alt="student"
                                    className="user__image"
                                />
                            </Tooltip>
                        )}
                    </div>
                </div>
                }
                    {(hasAccess || (course.students?.some(x => x.id === currentUser.id) && chapters.length > 0))&&
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
                                {modalChapter &&
                                    <MyModal visible={modalChapter} setVisible={setChapterModal}>
                                        <ChapterForm action={async () => {
                                            await dispatch(createChapter(setChapterModal))
                                        }} title="Create"/>
                                    </MyModal>
                                }
                                {totalChapterCount > 0 &&
                                    <Tooltip title="Add video" placement="bottom">
                                        <IconButton aria-label="add video" onClick={() => setVideoModal(true)}>
                                            <VideoLibraryIcon/>
                                        </IconButton>
                                    </Tooltip>
                                }
                                {videoModal &&
                                    <MyModal visible={videoModal} setVisible={setVideoModal}>
                                        <VideoForm
                                            action={ () => {
                                                dispatch(createVideo(setVideoModal))
                                            }}
                                            title="Add video"
                                            submitTitle="Add"
                                            setVisible={setVideoModal}
                                        />
                                    </MyModal>
                                }
                                {videoUpdateModal &&
                                    <MyModal visible={videoUpdateModal} setVisible={setVideoUpdateModal}>
                                        <VideoForm
                                            action={async () => {
                                                dispatch(updateVideo(setVideoUpdateModal))
                                            }}
                                            title="Update video"
                                            submitTitle="Save"
                                            setVisible={setVideoUpdateModal}
                                        />
                                    </MyModal>
                                }
                                {modalChapterUpdate &&
                                    <MyModal visible={modalChapterUpdate} setVisible={setChapterUpdateModal}>
                                        <ChapterForm action={async () => {
                                            await dispatch(updateChapter(setChapterUpdateModal))
                                        }} title="Save"/>
                                    </MyModal>
                                }
                            </div>
                            }
                        </div>
                        {chapters.length > 0 &&
                        <div>
                            <MyPagination
                                page={chaptersParams.page}
                                pageSize={chaptersParams.take}
                                pageCount={chapters.length}
                                totalCount={totalChapterCount}
                                changePage={changeChaptersPage}
                            />
                            <ChapterList
                                chapters={chapters}
                                update={() =>
                                    setChapterUpdateModal(true)
                                }
                                updateVideo={() => setVideoUpdateModal(true)}
                                remove={removeChapter}
                                removeVideo={removeVideo}
                                userId={currentUser.id}
                                isAdmin={isAdmin}
                            />
                            <MyPagination
                                page={chaptersParams.page}
                                pageSize={chaptersParams.take}
                                pageCount={chapters.length}
                                totalCount={totalChapterCount}
                                changePage={changeChaptersPage}
                            />
                        </div>
                        }
                    </div>
                    }
                    {comments.length > 0 &&
                        <div>
                            <div className="comments__title">
                                <h4>{totalCommentCount} comments :</h4>
                            </div>
                            {comments.length > 0 &&
                                <div>
                                    <MyPagination
                                        page={commentsParams.page}
                                        pageSize={commentsParams.take}
                                        pageCount={comments.length}
                                        totalCount={totalCommentCount}
                                        changePage={changeCommentsPage}
                                    />
                                    <CommentList
                                        comments={comments}
                                        update={() => setCommentModal(true)}
                                        remove={removeComment}
                                        userId={currentUser.id}
                                        isAdmin={isAdmin}
                                    />
                                    <MyPagination
                                        page={commentsParams.page}
                                        pageSize={commentsParams.take}
                                        pageCount={comments.length}
                                        totalCount={totalCommentCount}
                                        changePage={changeCommentsPage}
                                    />
                                </div>
                            }
                            {modalComment && <MyModal visible={modalComment} setVisible={setCommentModal}>
                                <CommentForm action={async () => {
                                    dispatch(updateComment(setCommentModal))
                                }} title="Save"/>
                            </MyModal>
                            }
                        </div>
                    }
                </div>
                    {hasUserAccess &&
                    <div style={{position: "fixed", bottom: 25, right: 25}}>
                        <ThemeProvider theme={colorTheme}>
                            <Tooltip title="Add comment" placement="left">
                                    <Fab color="primary" aria-label="add" size="medium" onClick={() => {
                                        dispatch(clearComment())
                                        setCommentUpdateModal(true)
                                    }}
                                         className={classes.navbar__link}>
                                        <AddIcon/>
                                    </Fab>
                            </Tooltip>
                        </ThemeProvider>
                        {commentUpdateModal &&
                        <MyModal visible={commentUpdateModal} setVisible={setCommentUpdateModal}>
                            <CommentForm
                                action={async () => {
                                    await dispatch(createComment(setCommentUpdateModal))
                                }}
                                title="Save"
                            />
                        </MyModal>
                        }
                    </div>
                    }
            </>
                : <Loading/>
            }
        </div>
    );
};
export default CoursePage;