

const defaultState = {
    theme : {
        id: '',
        title: '',
        categoryId: ''
    },
    themes : []
}

const SET_THEME = "SET_THEME"
const CLEAR_THEME = "CLEAR_THEME"
const SET_THEMES = "SET_THEMES"
const CLEAR_THEMES = "CLEAR_THEMES"

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
        default:
            return state
    }
}

export const setTheme = (payload) => ({type: SET_THEME, payload: payload})
export const clearTheme = () => ({type: CLEAR_THEME})
export const setThemes = (payload) => ({type: SET_THEMES, payload: payload})
export const clearThemes = () => ({type: CLEAR_THEMES})
