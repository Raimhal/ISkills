

const defaultState = {
    chapter : {
        id: '',
        title: '',
        description: '',
        courseId: '',
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
}

const SET_CHAPTER = "SET_CHAPTER"
const CLEAR_CHAPTER = "CLEAR_CHAPTER"
const SET_CHAPTERS = "SET_CHAPTERS"
const CLEAR_CHAPTERS = "CLEAR_CHAPTERS"
const SET_PARAMS = "SET_PARAMS"
const CLEAR_PARAMS = "CLEAR_PARAMS"
const SET_TOTAL_COUNT = "SET_TOTAL_COUNT"
const CLEAR_TOTAL_COUNT = "CLEAR_TOTAL_COUNT"

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
