import {responseHandler} from "./ResponseHandler";
import ThemeService from "../API/ThemeService";



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
    themes : [],
    isLoading: false,
    error: ''
}

const SET_THEME = "SET_THEME"
const CLEAR_THEME = "CLEAR_THEME"
const SET_THEMES = "SET_THEMES"
const CLEAR_THEMES = "CLEAR_THEMES"
const SET_PARAMS = "SET_PARAMS"
const CLEAR_PARAMS = "CLEAR_PARAMS"
const SET_TOTAL_COUNT = "SET_TOTAL_COUNT"
const CLEAR_TOTAL_COUNT = "CLEAR_TOTAL_COUNT"
const SET_LOADING = "SET_LOADING"
const CLEAR_LOADING = "CLEAR_LOADING"
const SET_ERROR = "SET_ERROR"
const CLEAR_ERROR = "CLEAR_ERROR"

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

export const setTheme = (payload) => ({type: SET_THEME, payload: payload})
export const clearTheme = () => ({type: CLEAR_THEME})
export const setThemes = (payload) => ({type: SET_THEMES, payload: payload})
export const clearThemes = () => ({type: CLEAR_THEMES})
export const setParams = (payload) => ({type: SET_PARAMS, payload: payload})
export const clearParams = () => ({type: CLEAR_PARAMS})
export const setTotalCount = (payload) => ({type: SET_TOTAL_COUNT, payload: payload})
export const clearTotalCount = () => ({type: CLEAR_TOTAL_COUNT})
export const setLoading = (payload) => ({type: SET_LOADING, payload: payload})
export const clearLoading = () => ({type: CLEAR_LOADING})
export const setError = (payload) => ({type: SET_ERROR, payload: payload})
export const clearError = () => ({type: CLEAR_ERROR})

export const getAllThemes = () => async (dispatch, getState) => {
    const params = getState().category.params
    const newParams = {...params}

    delete newParams.skip
    delete newParams.take

    dispatch(setParams(newParams))

    await getThemes()
};

export const getThemes = (categoryId = null) => async (dispatch, getState) => {
    const params = getState().theme.params

    await responseHandler(dispatch, async () => {
        if (params.query === '')
            delete params.query
        const newParams = {
            ...params,
            skip: (params.page - 1) * params.take,
            categoryId: categoryId
        }

        const [totalCount, newThemes] = await ThemeService.GetThemes({
            params: newParams
        })
        dispatch(setParams(newParams))
        dispatch(setThemes(newThemes))
        dispatch(setTotalCount(+totalCount))
    }, setError, setLoading)
};

export const createTheme = () => async (dispatch, getState) => {
    const state = getState().theme
    const theme = state.theme
    const themes= state.themes

    await responseHandler(dispatch, async () => {
        const themeId = await ThemeService.Create(theme)
        dispatch(setTheme({...theme, id: themeId}))
        dispatch(setThemes([...themes, theme]))
    }, setError, setLoading)
}

export const removeTheme = id => async (dispatch, getState) => {
    const state = getState().theme
    const themes = state.themes
    const totalCount = state.totalCount

    await responseHandler(dispatch, async () => {
        await ThemeService.Delete(id)
        dispatch(setThemes(themes.filter(c => c.id !== id)))
        dispatch(setTotalCount(+totalCount - 1))
    }, setError, setLoading)

}

export const updateTheme = () => async (dispatch, getState)  => {
    const state = getState().theme
    const theme = state.theme
    const themes = state.themes

    await responseHandler(dispatch, async () => {
        const index = themes.findIndex(x => x.id === theme.id)
        await ThemeService.Update(theme.id, theme)
        themes[index] = theme
        dispatch(setThemes([...themes]))
    }, setError, setLoading)
}