import {responseHandler} from "./ResponseHandler";
import ThemeService from "../API/ThemeService";
import {setCategories} from "./CategoryReducer";

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
    isActionLoading: false,
    isDeleteLoading: false,
    error: null
}

const SET_THEME = "SET_THEME"
const CLEAR_THEME = "CLEAR_THEME"
const SET_THEMES = "SET_THEMES"
const CLEAR_THEMES = "CLEAR_THEMES"
const SET_PARAMS = "SET_THEME_PARAMS"
const CLEAR_PARAMS = "CLEAR_THEME_PARAMS"
const SET_TOTAL_COUNT = "SET_THEME_TOTAL_COUNT"
const CLEAR_TOTAL_COUNT = "CLEAR_THEME_TOTAL_COUNT"
const SET_LOADING = "SET_THEME_LOADING"
const CLEAR_LOADING = "CLEAR_THEME_LOADING"
const SET_ACTION_LOADING = "SET_THEME_ACTION_LOADING"
const CLEAR_ACTION_LOADING = "CLEAR_THEME_ACTION_LOADING"
const SET_DELETE_LOADING = "SET_THEME_DELETE_LOADING"
const CLEAR_DELETE_LOADING = "CLEAR_THEME_DELETE_LOADING"
const SET_ERROR = "SET_THEME_ERROR"
const CLEAR_ERROR = "CLEAR_THEME_ERROR"

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
export const setActionLoading = (payload) => ({type: SET_ACTION_LOADING, payload: payload})
export const clearActionLoading = () => ({type: CLEAR_ACTION_LOADING})
export const setDeleteLoading = (payload) => ({type: SET_DELETE_LOADING, payload: payload})
export const clearDeleteLoading = () => ({type: CLEAR_DELETE_LOADING})
export const setError = (payload) => ({type: SET_ERROR, payload: payload})
export const clearError = () => ({type: CLEAR_ERROR})

export const getAllThemes = (categoryId = null) => async (dispatch, getState) => {
    const params = getState().theme.params
    const categories = getState().category.categories

    await responseHandler(dispatch, async () => {
        if (params.query === '')
            delete params.query
        const newParams = {
            ...params,
            categoryId: categoryId
        }

        const index = categories.findIndex(x => x.id === categoryId)

        const themes = await ThemeService.GetThemesAll({
            params: newParams
        })

        dispatch(setParams(newParams))
        dispatch(setThemes(themes))
        categories[index].themes = [...themes]
        dispatch(setCategories([...categories]))
    }, setError, setLoading)
};

export const getTheme = (id) => async (dispatch) => {
    await responseHandler(dispatch, async () => {
        const theme = await ThemeService.GetTheme(id)
        dispatch(setTheme(theme))
    }, setError, setLoading)
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

export const createTheme = (setModal = null) => async (dispatch, getState) => {
    const state = getState().theme
    const theme = state.theme
    const themes= state.themes

    await responseHandler(dispatch, async () => {
        const themeId = await ThemeService.Create(theme)
        const newTheme = {...theme, id: themeId}
        dispatch(setThemes([...themes, {...newTheme}]))
        dispatch(clearTheme())
        setModal && setModal(false)
    }, setError, setActionLoading)
}

export const removeTheme = id => async (dispatch, getState) => {
    const state = getState().theme
    const themes = state.themes
    const totalCount = state.totalCount

    await responseHandler(dispatch, async () => {
        await ThemeService.Delete(id)
        dispatch(setThemes(themes.filter(c => c.id !== id)))
        dispatch(setTotalCount(+totalCount - 1))
    }, setError, setDeleteLoading)
}

export const updateTheme = (setModal = null) => async (dispatch, getState)  => {
    const state = getState().theme
    const theme = state.theme
    const themes = state.themes

    await responseHandler(dispatch, async () => {
        const index = themes.findIndex(x => x.id === theme.id)
        await ThemeService.Update(theme.id, theme)
        themes[index] = theme
        dispatch(setThemes([...themes]))
        dispatch(clearTheme())
        setModal && setModal(false)
    }, setError, setActionLoading)
}