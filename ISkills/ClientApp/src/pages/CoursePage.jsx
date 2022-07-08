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
import {
    clearCourse, clearCourseLoading,
    clearError,
    getCourse,
    setCourse,
    setCourseLoading,
    updateCourse,
    updateImage
} from "../store/CourseReducer";
import {
    clearComment,
    clearComments,
    createComment,
    getComments,
    removeComment,
    setParams as setCommentsParams,
    updateComment,
    clearError as clearCommentError
} from "../store/CommentReducer";
import {assignUser, clearUsers, getCurrentUser, getUsers, setParams as setUsersParams} from "../store/UserReducer";
import MyTextarea from "../components/UI/Textarea/MyTextarea";
import {
    clearChapters,
    createChapter,
    getChapters,
    removeChapter,
    setParams as setChaptersParams,
    updateChapter,
    clearError as clearChapterError, clearChapter
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
import {createVideo, removeVideo, updateVideo, clearError as clearVideoError, clearVideo} from "../store/VideoReducer";
import classes from "../components/UI/Navbar/Navbar.module.css";
import AddIcon from "@mui/icons-material/Add";
import {colorTheme} from "../styleThemes";
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import InnerLoading from "../components/UI/Loading/InnerLoading";
import {curveCatmullRom} from 'd3-shape';
import {
    XYPlot,
    LineSeries,
    HorizontalGridLines,
    VerticalGridLines,
    XAxis,
    ChartLabel,
    YAxis,
    LineSeriesCanvas,
    LabelSeries,
    VerticalBarSeriesCanvas,
    Hint,
    Crosshair,
    VerticalBarSeries,
    makeWidthFlexible,
    FlexibleXYPlot, FlexibleWidthXYPlot
} from 'react-vis';
import BarSeries from "react-vis/es/plot/series/bar-series";
import {
    clearPurchases,
    getPurchasesStatistic,
    clearLoading as clearPurchaseLoading,
    generateClientToken,
    clearClientToken,
    setParams as setPurchasesParams,
    clearParams as clearPurchaseParams
} from "../store/PurchaseReducer";
import BraintreeDropIn from "../components/UI/Braintree/BraintreeDtopIn";
import NotFoundPage from "./NotFoundPage";
import {Area} from "@ant-design/plots";
import {ButtonToolbar, Dropdown} from "rsuite";

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
    const isCourseLoading = useSelector(state => state.course.isCourseLoading)

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
    const isLoading = useSelector(state => state.user.isLoading)
    const isAssignLoading = useSelector(state => state.user.isActionLoading)
    const isPurchaseLoading = useSelector(state => state.purchase.isLoading)
    const isClientTokenLoading = useSelector(state => state.purchase.isClientTokenLoading)

    const purchases = useSelector(state => state.purchase.purchases)
    const purchaseDays = useSelector(state => state.purchase.params.days)
    const clientToken = useSelector(state => state.purchase.clientToken)

    const purchasesParams = useSelector(state => state.purchase.params)

    const [modal, setModal] = useState(false)

    const [modalComment, setCommentModal] = useState(false)
    const [commentUpdateModal, setCommentUpdateModal] = useState(false)

    const [modalChapter, setChapterModal] = useState(false)
    const [modalChapterUpdate, setChapterUpdateModal] = useState(false)

    const [videoModal, setVideoModal] = useState(false)
    const [videoUpdateModal, setVideoUpdateModal] = useState(false)

    const [imageModal, setImageModal] = useState(false)

    const [showBraintreeDropIn, setShowBraintreeDropIn] = useState(false);

    useEffect(() => {

        dispatch(getCourse(id))
        dispatch(getPurchasesStatistic(id))

        return () => {
            dispatch(clearCourse())
            dispatch(clearComments())
            dispatch(clearUsers())
            dispatch(clearChapters())
            dispatch(clearPurchases())
            dispatch(clearCourseLoading())
            dispatch(clearPurchaseLoading())
            dispatch(clearPurchaseParams())
        }
    }, [])

    useEffect(() => {
        dispatch(getComments(id))
    }, [commentsParams.page])

    useEffect(() => {
        dispatch(getChapters(id))
    }, [chaptersParams.page])

    useEffect(() => {
        dispatch(getPurchasesStatistic())
    }, [purchasesParams.days])

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
            {!isCourseLoading ?
                <>
                    {!error ?
                        <div>
                            <div className="block">
                                <div className="course__head">
                                    <img
                                        src={course.imageUrl || defaultCourseImage}
                                        alt="course image"
                                        className="course__image"
                                        onClick={() => hasAccess && setImageModal(true)}
                                        style={{cursor: hasAccess && "pointer"}}
                                    />
                                    <div style={{padding: "0.5rem"}}>
                                        <h4>{course.title}</h4>
                                        <div className="language">
                                            <img src={languageImage} alt="language : " style={{width: 16}}/>
                                            <div>{course.language}</div>
                                        </div>
                                        <div>Created: {new Date(course.dateCreated).toLocaleDateString()}</div>
                                        {new Date(course.dateCreated) < new Date(course.dateUpdated) &&
                                        <div>Last updated: {new Date(course.dateUpdated).toLocaleDateString()}</div>
                                        }
                                        {course.rating > 0 && <MyRating value={course.rating} readonly/>}
                                        <div>Theme: {course.theme?.title}</div>
                                        {totalChapterCount > 0 &&
                                        <div>{totalChapterCount} {totalChapterCount === 1 ? "chapter" : "chapters"}</div>}
                                        {course.students.length > 0 &&
                                        <div>{course.students.length} {course.students.length === 1 ? "student" : "students"}</div>}
                                    </div>
                                </div>
                                {showBraintreeDropIn &&
                                <MyModal visible={showBraintreeDropIn} setVisible={setShowBraintreeDropIn}>
                                    <BraintreeDropIn
                                        show={showBraintreeDropIn}
                                        onPaymentCompleted={() => {
                                            setShowBraintreeDropIn(false);
                                        }}
                                        clientToken={clientToken}
                                    />
                                </MyModal>
                                }
                                {!hasUserAccess &&
                                <div>
                                    {course.price === 0
                                        ? <div className="price">
                                            <div> Free</div>
                                            {!isAssignLoading
                                                ? <MyButton onClick={() => {
                                                    if (!isAuth)
                                                        navigate('/login')
                                                    else
                                                        dispatch(assignUser())
                                                }}
                                                >Get</MyButton>
                                                : <InnerLoading/>
                                            }
                                        </div>
                                        : <div className="price">
                                            <div>{course.price} $</div>
                                            {!isAssignLoading
                                                ? <MyButton onClick={() => {
                                                    if (!isAuth)
                                                        navigate('/login')
                                                    else
                                                        setShowBraintreeDropIn(true)
                                                }}>Buy now</MyButton>
                                                : <InnerLoading/>
                                            }
                                        </div>
                                    }
                                </div>
                                }
                                {hasAccess &&
                                <div style={{display: "flex", justifyContent: "flex-end"}}>
                                    <Tooltip title="Edit" placement="bottom">
                                        <IconButton aria-label="edit" onClick={() => {
                                            dispatch(clearError())
                                            const category = categories.find(x => x.id === course.theme?.categoryId)
                                            dispatch(setCourse({...course, categoryId: category.id}))
                                            setModal(true)
                                        }}>
                                            <EditIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Update image" placement="bottom">
                                        <IconButton aria-label="update image" onClick={() => {
                                            dispatch(clearError())
                                            setImageModal(true)
                                        }}>
                                            <CameraAltOutlinedIcon/>
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                }
                            </div>
                            <div className="course__page">
                                {course.description && course.description.trim() !== '<p></p>' &&
                                <div className="block">
                                    <h5>Description :</h5>
                                    <MyTextarea value={course.description}/>
                                </div>
                                }
                                {course.requirements && course.requirements.trim() !== '<p></p>' &&
                                <div className="block">
                                    <h5>Requirements :</h5>
                                    <MyTextarea value={course.requirements}/>
                                </div>
                                }
                                <div className="block">
                                    <h5 className="flex-row">
                                        <span>Purchases for last</span>
                                        <ButtonToolbar>
                                            <Dropdown trigger="click" title={purchasesParams.days} size="md" placement="bottomEnd" disabled={isPurchaseLoading}>
                                                <Dropdown.Item disabled={true}>Days</Dropdown.Item>
                                                {[7, 14, 21, 30, 60, 90].map(days =>
                                                    <Dropdown.Item eventKey={days} key={days} onSelect={() => {
                                                        !isPurchaseLoading && dispatch(setPurchasesParams({...purchasesParams, days: days}))
                                                    }} active={days === purchaseDays}>{days}</Dropdown.Item>
                                                )}
                                            </Dropdown>
                                        </ButtonToolbar>
                                        <span>days :</span>
                                    </h5>
                                    <Area {...{
                                        data: purchases,
                                        autoFit: true,
                                        appendPadding: 10,
                                        xField: 'day',
                                        yField: 'amount',
                                        xAxis: {
                                            range: [0, 1],
                                            tickCount: 0,
                                        },
                                        point: {
                                            size: purchaseDays > 30 ? (180 / purchaseDays)  + 1 : 5,
                                        },
                                        slider: {
                                            start: 0,
                                            end: 1,
                                            trendCfg: {
                                                isArea: true,
                                                smooth: true
                                            },
                                        },
                                        pattern: {
                                            type: 'line',
                                            cfg: {
                                                stroke: '#38023B',
                                            },
                                        },
                                        autoHide: true,
                                        animation: {
                                            appear: {
                                                animation: 'fadeIn',
                                            },
                                        },
                                        areaStyle: () => {
                                            return {
                                                gradient: 'l(0) 0:#9c27b0 1:#ccccff',
                                            };
                                        },
                                        color: '#975ad4'
                                    }} />
                                    {isPurchaseLoading && <Loading/>}
                                </div>
                                {hasAccess &&
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
                                {course.students.length > 0 &&
                                <div className="block">
                                    <h5>{course.students.length} {course.students.length === 1 ? "student" : "students"} : </h5>
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
                                {(hasAccess || (course.students?.some(x => x.id === currentUser.id) && chapters.length > 0)) &&
                                <div className="block">
                                    <div className="chapter__title">
                                        <h5>{totalChapterCount} {totalChapterCount === 1 ? "chapter" : "chapters"} :</h5>
                                        {(currentUser.id === course.creatorId || isAdmin) &&
                                        <div>
                                            <Tooltip title="Add chapter" placement="bottom">
                                                <IconButton aria-label="add chapter" onClick={() => {
                                                    dispatch(clearChapter())
                                                    dispatch(clearChapterError())
                                                    setChapterModal(true)
                                                }}>
                                                    <AddBoxIcon/>
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
                                                <IconButton aria-label="add video" onClick={() => {
                                                    dispatch(clearVideo())
                                                    dispatch(clearVideoError())
                                                    setVideoModal(true)
                                                }}>
                                                    <VideoLibraryIcon/>
                                                </IconButton>
                                            </Tooltip>
                                            }
                                            {videoModal &&
                                            <MyModal visible={videoModal} setVisible={setVideoModal}>
                                                <VideoForm
                                                    action={() => {
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
                                            update={() => {
                                                dispatch(clearChapterError())
                                                setChapterUpdateModal(true)
                                            }}
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
                                <div className="block">
                                    <div className="comments__title">
                                        <h5>{totalCommentCount} {totalCommentCount === 1 ? "comment" : "comments"} :</h5>
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
                                            update={() => {
                                                dispatch(clearCommentError())
                                                setCommentModal(true)
                                            }}
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
                                            dispatch(clearCommentError())
                                            setCommentUpdateModal(true)
                                        }}
                                             className={classes.navbar__link}>
                                            <StarBorderOutlinedIcon/>
                                        </Fab>
                                    </Tooltip>
                                </ThemeProvider>
                            </div>
                            }
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
                        : <NotFoundPage/>
                    }
                </>
                : <Loading/>
            }
                </div>
    );
};

export default CoursePage;