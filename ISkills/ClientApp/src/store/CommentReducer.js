import {responseHandler} from "./ResponseHandler";
import CommentService from "../API/CommentService";
import {setCourse} from "./CourseReducer";


const defaultState = {
    comment: {
        content: '',
        commentId: '',
        rating: 5
    },
    comments: [],
    totalCount: 0,
    params: {
        page: 1,
        skip: 0,
        take: 10,
        reverse: false,
    },
    sortList: [
        {name: 'Rating', value: 'rating'},
        {name: 'Course', value: 'courseId'},
        {name: 'Creator', value: 'creatorId'},
    ],
    isLoading: false,
    error: ''
}

const SET_COMMENT = "SET_COMMENT"
const CLEAR_COMMENT = "CLEAR_COMMENT"
const SET_COMMENTS = "SET_COMMENTS"
const CLEAR_COMMENTS = "CLEAR_COMMENTS"
const SET_PARAMS = "SET_PARAMS"
const CLEAR_PARAMS = "CLEAR_PARAMS"
const SET_TOTAL_COUNT = "SET_TOTAL_COUNT"
const CLEAR_TOTAL_COUNT = "CLEAR_TOTAL_COUNT"
const SET_LOADING = "SET_LOADING"
const CLEAR_LOADING = "CLEAR_LOADING"
const SET_ERROR = "SET_ERROR"
const CLEAR_ERROR = "CLEAR_ERROR"

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
export const setError = (payload) => ({type: SET_ERROR, payload: payload})
export const clearError = () => ({type: CLEAR_ERROR})

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

    await responseHandler(dispatch, async () => {
        await CommentService.Delete(id)
        dispatch(setComments(comments.filter(c => c.id !== id)))
        dispatch(setTotalCount(+totalCount - 1))
    }, setError, setLoading)

}

export const updateComment = () => async (dispatch, getState)  => {
    const state = getState().comment
    const comment = state.comment
    const comments = state.comments
    await responseHandler(dispatch, async () => {
        const index = comments.findIndex(x => x.id === comment.id)
        await CommentService.Update(comment.id, comment)
        comments[index] = comment
        dispatch(setComments([...comments]))
    }, setError, setLoading)
}