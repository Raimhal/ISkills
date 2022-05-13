

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
        reverse: false,
    },
    sortList: [
        {name: 'Rating', value: 'rating'},
        {name: 'Course', value: 'courseId'},
        {name: 'Creator', value: 'creatorId'},
    ],
}

const SET_COMMENT = "SET_COMMENT"
const CLEAR_COMMENT = "CLEAR_COMMENT"
const SET_COMMENTS = "SET_COMMENTS"
const CLEAR_COMMENTS = "CLEAR_COMMENTS"
const SET_PARAMS = "SET_PARAMS"
const CLEAR_PARAMS = "CLEAR_PARAMS"
const SET_TOTAL_COUNT = "SET_TOTAL_COUNT"
const CLEAR_TOTAL_COUNT = "CLEAR_TOTAL_COUNT"

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
