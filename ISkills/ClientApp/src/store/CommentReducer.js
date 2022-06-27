import {responseHandler} from "./ResponseHandler";
import CommentService from "../API/CommentService";
import {setCourse} from "./CourseReducer";


const defaultState = {
    comment: {
        content: '',
        courseId: '',
        rating: 5
    },
    comments: [],
    totalCount: 0,
    params: {
        page: 1,
        skip: 0,
        take: 10,
        reverse: true,
        sortOption: 'date'
    },
    sortList: [
        {name: 'Rating', value: 'rating'},
        {name: 'Course', value: 'courseId'},
        {name: 'Creator', value: 'creatorId'},
        {name: 'Date', value: 'date'},
    ],
    isLoading: true,
    isActionLoading: false,
    isDeleteLoading: false,
    error: null
}

const SET_COMMENT = "SET_COMMENT"
const CLEAR_COMMENT = "CLEAR_COMMENT"
const SET_COMMENTS = "SET_COMMENTS"
const CLEAR_COMMENTS = "CLEAR_COMMENTS"
const SET_PARAMS = "SET_COMMENT_PARAMS"
const CLEAR_PARAMS = "CLEAR_COMMENT_PARAMS"
const SET_TOTAL_COUNT = "SET_COMMENT_TOTAL_COUNT"
const CLEAR_TOTAL_COUNT = "CLEAR_COMMENT_TOTAL_COUNT"
const SET_LOADING = "SET_COMMENT_LOADING"
const CLEAR_LOADING = "CLEAR_COMMENT_LOADING"
const SET_ACTION_LOADING = "SET_COMMENT_ACTION_LOADING"
const CLEAR_ACTION_LOADING = "CLEAR_COMMENT_ACTION_LOADING"
const SET_DELETE_LOADING = "SET_COMMENT_DELETE_LOADING"
const CLEAR_DELETE_LOADING = "CLEAR_COMMENT_DELETE_LOADING"
const SET_ERROR = "SET_COMMENT_ERROR"
const CLEAR_ERROR = "CLEAR_COMMENT_ERROR"

export const CommentReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_COMMENT:
            return {...state, comment: action.payload}
        case SET_COMMENTS:
            return {...state, comments: action.payload}
        case CLEAR_COMMENT:
            return {...state, comment: defaultState.comment}
        case CLEAR_COMMENTS:
            return {...state, comments: defaultState.comments}
        case SET_PARAMS:
            return {...state, params: action.payload}
        case CLEAR_PARAMS:
            return {...state, params: defaultState.params}
        case SET_TOTAL_COUNT:
            return {...state, totalCount: action.payload}
        case CLEAR_TOTAL_COUNT:
            return {...state, totalCount: defaultState.params}
        case SET_LOADING:
            return {...state, isLoading: action.payload}
        case CLEAR_LOADING:
            return {...state, isLoading: defaultState.isLoading}
        case SET_ACTION_LOADING:
            return {...state, isActionLoading: action.payload}
        case CLEAR_ACTION_LOADING:
            return {...state, isActionLoading: defaultState.isLoading}
        case SET_DELETE_LOADING:
            return {...state, isDeleteLoading: action.payload}
        case CLEAR_DELETE_LOADING:
            return {...state, isDeleteLoading: defaultState.isLoading}
        case SET_ERROR:
            return {...state, error: action.payload}
        case CLEAR_ERROR:
            return {...state, error: defaultState.error}
        default:
            return state
    }
}

export const setComment = (payload) => ({type: SET_COMMENT, payload: payload})
export const clearComment = () => ({type: CLEAR_COMMENT})
export const setComments = (payload) => ({type: SET_COMMENTS, payload: payload})
export const clearComments = () => ({type: CLEAR_COMMENTS})
export const setParams = (payload) => ({type: SET_PARAMS, payload: payload})
export const clearParams = () => ({type: CLEAR_PARAMS})
export const setTotalCount = (payload) => ({type: SET_TOTAL_COUNT, payload: payload})
export const clearTotalCount = () => ({type: CLEAR_TOTAL_COUNT})
export const setLoading = (payload) => ({type: SET_LOADING, payload: payload})
export const clearLoading = () => ({type: CLEAR_LOADING})
export const setActionLoading = (payload) => ({type: SET_ACTION_LOADING, payload: payload})
export const clearActionLoading = () => ({type: CLEAR_ACTION_LOADING})
export const setDeleteLoading = (payload) => ({type: SET_DELETE_LOADING, payload: payload})
export const clearDeleteLoading = () => ({type: CLEAR_DELETE_LOADING})
export const setError = (payload) => ({type: SET_ERROR, payload: payload})
export const clearError = () => ({type: CLEAR_ERROR})

export const createComment = (setModal = null) => async(dispatch, getState) => {
    const comment = getState().comment.comment
    const course = getState().course.course
    const comments = getState().comment.comments
    const totalCount = getState().comment.totalCount
    const currentUser = getState().user.user

    await responseHandler(dispatch, async () => {
        const commentId = await CommentService.Create({...comment, courseId: course.id})
        const date = new Date()
        const newComment = {...comment, id: commentId, creator: currentUser, creatorId: currentUser.id, date: date, dateUpdated: date, courseId: course.id}
        dispatch(setComments([newComment, ...comments]))
        const newRating = ((course.rating * +totalCount + comment.rating) / (+totalCount + 1))
        dispatch(setCourse({...course, rating: newRating }))
        dispatch(setTotalCount(+totalCount + 1))
        dispatch(clearComment())
        setModal && setModal(false)
    }, setError, setActionLoading)
}

export const getComments = (courseId = null) => async (dispatch, getState) => {
    const params = getState().comment.params

    await responseHandler(dispatch, async () => {
        if (params.query === '')
            delete params.query
        const newParams = {
            ...params,
            skip: (params.page - 1) * params.take,
            courseId: courseId
        }

        const [totalCount, newComments] = await CommentService.GetComments({
            params: newParams
        })
        dispatch(setParams(newParams))
        dispatch(setComments(newComments))
        dispatch(setTotalCount(+totalCount))
    }, setError, setLoading)
};

export const removeComment = id => async (dispatch, getState) => {
    const state = getState().comment
    const comments = state.comments
    const totalCount = state.totalCount
    const course = getState().course.course

    await responseHandler(dispatch, async () => {
        const comment = comments.find(c => c.id === id)
        const newRating = (((course.rating * +totalCount - comment.rating) / (+totalCount - 1))) | 0
        dispatch(setCourse({...course, rating: newRating }))
        await CommentService.Delete(id)
        dispatch(setComments(comments.filter(c => c.id !== id)))
        dispatch(setTotalCount(+totalCount - 1))
    }, setError, setDeleteLoading)

}

export const updateComment = (setModal = null) => async (dispatch, getState)  => {
    const state = getState().comment
    const comment = state.comment
    const comments = state.comments
    const totalCount = state.totalCount
    const course = getState().course.course

    await responseHandler(dispatch, async () => {
        const index = comments.findIndex(x => x.id === comment.id)
        await CommentService.Update(comment.id, comment)
        const newRating = (course.rating * +totalCount + (comment.rating - comments[index].rating)) / +totalCount
        comments[index] = {...comment, rating: newRating}

        dispatch(setComments([...comments]))
        dispatch(clearComment())
        setModal && setModal(false)
    }, setError, setActionLoading)
}