

const defaultState = {
    comment: {
        content: '',
        courseId: '',
        rating: 5
    },
    comments: []
}

const SET_COMMENT = "SET_COMMENT"
const CLEAR_COMMENT = "CLEAR_COMMENT"
const SET_COMMENTS = "SET_COMMENTS"
const CLEAR_COMMENTS = "CLEAR_COMMENTS"

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
        default:
            return state
    }
}

export const setComment = (payload) => ({type: SET_COMMENT, payload: payload})
export const clearComment = () => ({type: CLEAR_COMMENT})
export const setComments = (payload) => ({type: SET_COMMENTS, payload: payload})
export const clearComments = () => ({type: CLEAR_COMMENTS})
