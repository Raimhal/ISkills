

const defaultState = {
    video : {
        id: '',
        title: '',
        url: '',
        chapterId: ''
    },
    videos : []
}

const SET_VIDEO = "SET_VIDEO"
const CLEAR_VIDEO = "CLEAR_VIDEO"
const SET_VIDEOS = "SET_VIDEOS"
const CLEAR_VIDEOS = "CLEAR_VIDEOS"

export const VideoReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_VIDEO:
            return {...state, video: action.payload}
        case SET_VIDEOS:
            return {...state, videos: action.payload}
        case CLEAR_VIDEO:
            return {...state, video: defaultState.video}
        case CLEAR_VIDEOS:
            return {...state, videos: defaultState.videos}
        default:
            return state
    }
}

export const setVideo = (payload) => ({type: SET_VIDEO, payload: payload})
export const clearVideo = () => ({type: CLEAR_VIDEO})
export const setVideos = (payload) => ({type: SET_VIDEOS, payload: payload})
export const clearVideos = () => ({type: CLEAR_VIDEOS})
