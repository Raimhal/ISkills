import {responseHandler} from "./ResponseHandler";
import VideoService from "../API/VideoService";
import {setChapters} from "./ChapterReducer";


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
    isActionLoading: false,
    isDeleteLoading: false,
    error: null
}

const SET_VIDEO = "SET_VIDEO"
const CLEAR_VIDEO = "CLEAR_VIDEO"
const SET_VIDEOS = "SET_VIDEOS"
const CLEAR_VIDEOS = "CLEAR_VIDEOS"
const SET_PARAMS = "SET_VIDEO_VIDEO_PARAMS"
const CLEAR_PARAMS = "CLEAR_VIDEO_PARAMS"
const SET_TOTAL_COUNT = "SET_VIDEO_TOTAL_COUNT"
const CLEAR_TOTAL_COUNT = "CLEAR_VIDEO_TOTAL_COUNT"
const SET_LOADING = "SET_VIDEO_LOADING"
const CLEAR_LOADING = "CLEAR_VIDEO_LOADING"
const SET_ACTION_LOADING = "SET_VIDEO_ACTION_LOADING"
const CLEAR_ACTION_LOADING = "CLEAR_VIDEO_ACTION_LOADING"
const SET_DELETE_LOADING = "SET_VIDEO_DELETE_LOADING"
const CLEAR_DELETE_LOADING = "CLEAR_VIDEO_DELETE_LOADING"
const SET_ERROR = "SET_VIDEO_ERROR"
const CLEAR_ERROR = "CLEAR_VIDEO_ERROR"

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
export const setActionLoading = (payload) => ({type: SET_ACTION_LOADING, payload: payload})
export const clearActionLoading = () => ({type: CLEAR_ACTION_LOADING})
export const setDeleteLoading = (payload) => ({type: SET_DELETE_LOADING, payload: payload})
export const clearDeleteLoading = () => ({type: CLEAR_DELETE_LOADING})
export const setError = (payload) => ({type: SET_ERROR, payload: payload})
export const clearError = () => ({type: CLEAR_ERROR})

export const getVideos = (chapterId = null) => async (dispatch, getState) => {
    const params = getState().video.params
    const chapters = getState().chapter.chapters

    await responseHandler(dispatch, async () => {
        if (params.query === '')
            delete params.query
        const newParams = {
            ...params,
            skip: (params.page - 1) * params.take,
            chapterId: chapterId
        }



        if(chapterId === null)
            delete newParams.chapterId

        const [totalCount, newVideos] = await VideoService.GetVideos({
            params: newParams
        })

        if(chapterId !== null) {
            const index = chapters.findIndex(x => x.id === chapterId)
            chapters[index].videos = newVideos
            chapters[index].videosCount = totalCount
        }


        dispatch(setParams(newParams))
        dispatch(setVideos(newVideos))
        dispatch(setTotalCount(+totalCount))
        dispatch(setChapters([...chapters]))
    }, setError, setLoading)
};

export const createVideo = (setModal = null) => async (dispatch, getState) => {
    const state = getState().video
    const video = state.video
    const chapters = getState().chapter.chapters


    await responseHandler(dispatch, async () => {
        const index = chapters.findIndex(x => x.id === video.chapterId)
        const response = await VideoService.Create({...video, file: document.querySelector("#file").files[0]})
        const videoResponse = await VideoService.GetVideo(response.data)

        chapters[index].videos = [...chapters[index].videos, videoResponse.data]

        dispatch(setChapters(chapters))
        setModal && setModal(false)
    }, setError, setActionLoading)


}

export const removeVideo = id => async (dispatch, getState) => {
    const state = getState().video
    const chapters = getState().chapter.chapters
    const totalCount = state.totalCount

    await responseHandler(dispatch, async () => {
        const chapterIndex = chapters.findIndex(x =>
            x.id === chapters.find(x =>
                x.videos.some(x => x.id === id)).id)

        await VideoService.Delete(id)

        chapters[chapterIndex].videos = [...chapters[chapterIndex].videos.filter(x => x.id !== id)]
        chapters[chapterIndex].videosCount -= 1

        dispatch(setChapters([...chapters]))
        dispatch(setTotalCount(+totalCount - 1))
    }, setError, setDeleteLoading)

}

export const updateVideo = (setModal = null) => async (dispatch, getState)  => {
    const video = getState().video.video
    const chapters = getState().chapter.chapters

    await responseHandler(dispatch, async () => {
        const chapterIndex = chapters.findIndex(x => x.id === video.chapterId)
        const index = chapters[chapterIndex].videos.findIndex(x => x.id === video.id)
        await VideoService.Update({...video, file: document.querySelector("#file").files[0]})
        chapters[chapterIndex].videos[index] = video
        dispatch(setChapters([...chapters]))
        setModal && setModal(false)
    }, setError, setActionLoading)
}