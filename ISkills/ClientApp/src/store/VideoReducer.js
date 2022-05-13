

const defaultState = {
    video : {
        id: '',
        title: '',
        url: '',
        chapterId: ''
    },
    videos : [],
    totalCount: 0,
    params: {
        page: 1,
        skip: 0,
        take: 10,
        reverse: false,
    },
    sortList: [
        {name: 'Title', value: 'title'},
        {name: 'Chapter', value: 'chapterId'},
    ],
}

const SET_VIDEO = "SET_VIDEO"
const CLEAR_VIDEO = "CLEAR_VIDEO"
const SET_VIDEOS = "SET_VIDEOS"
const CLEAR_VIDEOS = "CLEAR_VIDEOS"
const SET_PARAMS = "SET_PARAMS"
const CLEAR_PARAMS = "CLEAR_PARAMS"
const SET_TOTAL_COUNT = "SET_TOTAL_COUNT"
const CLEAR_TOTAL_COUNT = "CLEAR_TOTAL_COUNT"

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

export const setVideo = (payload) => ({type: SET_VIDEO, payload: payload})
export const clearVideo = () => ({type: CLEAR_VIDEO})
export const setVideos = (payload) => ({type: SET_VIDEOS, payload: payload})
export const clearVideos = () => ({type: CLEAR_VIDEOS})
export const setParams = (payload) => ({type: SET_PARAMS, payload: payload})
export const clearParams = () => ({type: CLEAR_PARAMS})
export const setTotalCount = (payload) => ({type: SET_TOTAL_COUNT, payload: payload})
export const clearTotalCount = () => ({type: CLEAR_TOTAL_COUNT})