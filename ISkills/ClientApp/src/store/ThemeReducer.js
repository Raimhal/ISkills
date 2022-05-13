

const defaultState = {
    theme : {
        id: '',
        title: '',
        categoryId: ''
    },
    totalCount: 0,
    params: {
        page: 1,
        skip: 0,
        take: 10,
        reverse: false,
        categoryId: null,
    },
    sortList: [
        {name: 'Title', value: 'title'},
        {name: 'Category', value: 'categoryId'},
    ],
    themes : []
}

const SET_THEME = "SET_THEME"
const CLEAR_THEME = "CLEAR_THEME"
const SET_THEMES = "SET_THEMES"
const CLEAR_THEMES = "CLEAR_THEMES"
const SET_PARAMS = "SET_PARAMS"
const CLEAR_PARAMS = "CLEAR_PARAMS"
const SET_TOTAL_COUNT = "SET_TOTAL_COUNT"
const CLEAR_TOTAL_COUNT = "CLEAR_TOTAL_COUNT"

export const ThemeReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_THEME:
            return {...state, theme: action.payload}
        case SET_THEMES:
            return {...state, themes: action.payload}
        case CLEAR_THEME:
            return {...state, theme: defaultState.theme}
        case CLEAR_THEMES:
            return {...state, themes: defaultState.themes}
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

export const setTheme = (payload) => ({type: SET_THEME, payload: payload})
export const clearTheme = () => ({type: CLEAR_THEME})
export const setThemes = (payload) => ({type: SET_THEMES, payload: payload})
export const clearThemes = () => ({type: CLEAR_THEMES})
export const setParams = (payload) => ({type: SET_PARAMS, payload: payload})
export const clearParams = () => ({type: CLEAR_PARAMS})
export const setTotalCount = (payload) => ({type: SET_TOTAL_COUNT, payload: payload})
export const clearTotalCount = () => ({type: CLEAR_TOTAL_COUNT})

