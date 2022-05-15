import {responseHandler} from "./ResponseHandler";
import ChapterService from "../API/ChapterService";

const defaultState = {
    chapter : {
        id: '',
        title: '',
        description: '',
        chapterId: '',
        videos: []
    },
    chapters : [],
    totalCount: 0,
    params: {
        page: 1,
        skip: 0,
        take: 10,
        reverse: false,
    },
    sortList: [
        {name: 'Title', value: 'title'},
        {name: 'Course', value: 'courseId'},
    ],
    isLoading: false,
    error: ''
}

const SET_CHAPTER = "SET_CHAPTER"
const CLEAR_CHAPTER = "CLEAR_CHAPTER"
const SET_CHAPTERS = "SET_CHAPTERS"
const CLEAR_CHAPTERS = "CLEAR_CHAPTERS"
const SET_PARAMS = "SET_PARAMS"
const CLEAR_PARAMS = "CLEAR_PARAMS"
const SET_TOTAL_COUNT = "SET_TOTAL_COUNT"
const CLEAR_TOTAL_COUNT = "CLEAR_TOTAL_COUNT"
const SET_LOADING = "SET_LOADING"
const CLEAR_LOADING = "CLEAR_LOADING"
const SET_ERROR = "SET_ERROR"
const CLEAR_ERROR = "CLEAR_ERROR"

export const ChapterReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_CHAPTER:
            return {...state, chapter: action.payload}
        case SET_CHAPTERS:
            return {...state, chapters: action.payload}
        case CLEAR_CHAPTER:
            return {...state, chapter: defaultState.chapter}
        case CLEAR_CHAPTERS:
            return {...state, chapters: defaultState.chapters}
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

export const setChapter = (payload) => ({type: SET_CHAPTER, payload: payload})
export const clearChapter = () => ({type: CLEAR_CHAPTER})
export const setChapters = (payload) => ({type: SET_CHAPTERS, payload: payload})
export const clearChapters = () => ({type: CLEAR_CHAPTERS})
export const setParams = (payload) => ({type: SET_PARAMS, payload: payload})
export const clearParams = () => ({type: CLEAR_PARAMS})
export const setTotalCount = (payload) => ({type: SET_TOTAL_COUNT, payload: payload})
export const clearTotalCount = () => ({type: CLEAR_TOTAL_COUNT})
export const setLoading = (payload) => ({type: SET_LOADING, payload: payload})
export const clearLoading = () => ({type: CLEAR_LOADING})
export const setError = (payload) => ({type: SET_ERROR, payload: payload})
export const clearError = () => ({type: CLEAR_ERROR})


export const getChapters = () => async (dispatch, getState) => {
    const params = getState().chapter.params

    await responseHandler(dispatch, async () => {
        if (params.query === '')
            delete params.query
        const newParams = {
            ...params,
            skip: (params.page - 1) * params.take,
        }
        
        const [totalCount, newChapters] = await ChapterService.GetChapters({
            params: newParams
        })
        dispatch(setParams(newParams))
        dispatch(setChapters(newChapters))
        dispatch(setTotalCount(+totalCount))
    }, setError, setLoading)
};

export const removeChapter = id => async (dispatch, getState) => {
    const state = getState().chapter
    const chapters = state.chapters
    const totalCount = state.totalCount

    await responseHandler(dispatch, async () => {
        await ChapterService.Delete(id)
        dispatch(setChapters(chapters.filter(c => c.id !== id)))
        dispatch(setTotalCount(+totalCount - 1))
    }, setError, setLoading)

}

export const updateChapter = () => async (dispatch, getState)  => {
    const state = getState().chapter
    const chapter = state.chapter
    const chapters = state.chapters
    await responseHandler(dispatch, async () => {
        const index = chapters.findIndex(x => x.id === chapter.id)
        await ChapterService.Update(chapter.id, chapter)
        chapters[index] = chapter
        dispatch(setChapters([...chapters]))
    }, setError, setLoading)
}