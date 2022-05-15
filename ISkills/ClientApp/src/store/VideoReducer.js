import {responseHandler} from "./ResponseHandler";
import VideoService from "../API/VideoService";


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
    isLoading: false,
    error: ''
}

const SET_VIDEO = "SET_VIDEO"
const CLEAR_VIDEO = "CLEAR_VIDEO"
const SET_VIDEOS = "SET_VIDEOS"
const CLEAR_VIDEOS = "CLEAR_VIDEOS"
const SET_PARAMS = "SET_PARAMS"
const CLEAR_PARAMS = "CLEAR_PARAMS"
const SET_TOTAL_COUNT = "SET_TOTAL_COUNT"
const CLEAR_TOTAL_COUNT = "CLEAR_TOTAL_COUNT"
const SET_LOADING = "SET_LOADING"
const CLEAR_LOADING = "CLEAR_LOADING"
const SET_ERROR = "SET_ERROR"
const CLEAR_ERROR = "CLEAR_ERROR"

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

export const setVideo = (payload) => ({type: SET_VIDEO, payload: payload})
export const clearVideo = () => ({type: CLEAR_VIDEO})
export const setVideos = (payload) => ({type: SET_VIDEOS, payload: payload})
export const clearVideos = () => ({type: CLEAR_VIDEOS})
export const setParams = (payload) => ({type: SET_PARAMS, payload: payload})
export const clearParams = () => ({type: CLEAR_PARAMS})
export const setTotalCount = (payload) => ({type: SET_TOTAL_COUNT, payload: payload})
export const clearTotalCount = () => ({type: CLEAR_TOTAL_COUNT})
export const setLoading = (payload) => ({type: SET_LOADING, payload: payload})
export const clearLoading = () => ({type: CLEAR_LOADING})
export const setError = (payload) => ({type: SET_ERROR, payload: payload})
export const clearError = () => ({type: CLEAR_ERROR})

export const getVideos = (chapterId = null) => async (dispatch, getState) => {
    const params = getState().video.params

    await responseHandler(dispatch, async () => {
        if (params.query === '')
            delete params.query
        const newParams = {
            ...params,
            skip: (params.page - 1) * params.take,
        }
        if(chapterId === null)
            delete newParams.chapterId

        const [totalCount, newVideos] = await VideoService.GetVideos({
            params: newParams
        })
        dispatch(setParams(newParams))
        dispatch(setVideos(newVideos))
        dispatch(setTotalCount(+totalCount))
    }, setError, setLoading)
};

export const removeVideo = id => async (dispatch, getState) => {
    const state = getState().video
    const videos = state.videos
    const totalCount = state.totalCount

    await responseHandler(dispatch, async () => {
        await VideoService.Delete(id)
        dispatch(setVideos(videos.filter(c => c.id !== id)))
        dispatch(setTotalCount(+totalCount - 1))
    }, setError, setLoading)

}

export const updateVideo = () => async (dispatch, getState)  => {
    const state = getState().video
    const video = state.video
    const videos = state.videos

    await responseHandler(dispatch, async () => {
        const index = videos.findIndex(x => x.id === video.id)
        await VideoService.Update({...video, file: document.querySelector("#file").files[0]})
        videos[index] = video
        dispatch(setVideos([...videos]))
    }, setError, setLoading)
}