

const defaultState = {
    chapter : {
        id: '',
        title: '',
        description: '',
        courseId: ''
    },
    chapters : []
}

const SET_CHAPTER = "SET_CHAPTER"
const CLEAR_CHAPTER = "CLEAR_CHAPTER"
const SET_CHAPTERS = "SET_CHAPTERS"
const CLEAR_CHAPTERS = "CLEAR_CHAPTERS"

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
        default:
            return state
    }
}

export const setChapter = (payload) => ({type: SET_CHAPTER, payload: payload})
export const clearChapter = () => ({type: CLEAR_CHAPTER})
export const setChapters = (payload) => ({type: SET_CHAPTERS, payload: payload})
export const clearChapters = () => ({type: CLEAR_CHAPTERS})
