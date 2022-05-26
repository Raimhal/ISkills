import {responseHandler} from "./ResponseHandler";
import CategoryService from "../API/CategoryService";


const defaultState = {
    category : {
        id: '',
        title: '',
    },
    categories : [],
    totalCount: 0,
    params: {
        page: 1,
        skip: 0,
        take: 10,
        reverse: true,
        sortOption: 'title',
    },
    sortList: [
        {name: 'Id', value: 'id'},
        {name: 'Title', value: 'title'},
    ],
    isLoading: false,
    isActionLoading: false,
    isDeleteLoading: false,
    error: null
}

const SET_CATEGORY = "SET_CATEGORY"
const CLEAR_CATEGORY = "CLEAR_CATEGORY"
const SET_CATEGORIES = "SET_CATEGORIES"
const CLEAR_CATEGORIES = "CLEAR_CATEGORIES"
const SET_PARAMS = "SET_CATEGORY_PARAMS"
const CLEAR_PARAMS = "CLEAR_CATEGORY_PARAMS"
const SET_TOTAL_COUNT = "SET_CATEGORY_TOTAL_COUNT"
const CLEAR_TOTAL_COUNT = "CLEAR_CATEGORY_TOTAL_COUNT"
const SET_LOADING = "SET_CATEGORY_LOADING"
const CLEAR_LOADING = "CLEAR_CATEGORY_LOADING"
const SET_ACTION_LOADING = "SET_CATEGORY_ACTION_LOADING"
const CLEAR_ACTION_LOADING = "CLEAR_CATEGORY_ACTION_LOADING"
const SET_DELETE_LOADING = "SET_CATEGORY_DELETE_LOADING"
const CLEAR_DELETE_LOADING = "CLEAR_CATEGORY_DELETE_LOADING"
const SET_ERROR = "SET_CATEGORY_ERROR"
const CLEAR_ERROR = "CLEAR_CATEGORY_ERROR"

export const CategoryReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_CATEGORY:
            return {...state, category: action.payload}
        case SET_CATEGORIES:
            return {...state, categories: action.payload}
        case CLEAR_CATEGORY:
            return {...state, category: defaultState.category}
        case CLEAR_CATEGORIES:
            return {...state, categories: defaultState.categories}
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

export const setCategory = (payload) => ({type: SET_CATEGORY, payload: payload})
export const clearCategory = () => ({type: CLEAR_CATEGORY})
export const setCategories = (payload) => ({type: SET_CATEGORIES, payload: payload})
export const clearCategories = () => ({type: CLEAR_CATEGORIES})
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


export const getAllCategories = () => async (dispatch, getState) => {
    const params = getState().category.params

    await responseHandler(dispatch, async () => {
        if (params.query === '')
            delete params.query

        const categories = await CategoryService.GetCategoriesAll({
            params: params
        })
        dispatch(setCategories(categories))
    }, setError, setLoading)
};

export const getCategories = () => async (dispatch, getState) => {
    const params = getState().category.params

    await responseHandler(dispatch, async () => {
        if (params.query === '')
            delete params.query
        const newParams = {
            ...params,
            skip: (params.page - 1) * params.take,
        }

        const [totalCount, newCategories] = await CategoryService.GetCategories({
            params: newParams
        })
        dispatch(setParams(newParams))
        dispatch(setCategories(newCategories))
        dispatch(setTotalCount(+totalCount))
    }, setError, setLoading)
};

export const createCategory = (setModal = null) => async (dispatch, getState) => {
    const state = getState().category
    const category = state.category
    const categories= state.categories

    await responseHandler(dispatch, async () => {
        const categoryId = await CategoryService.Create(category)
        dispatch(setCategory({...category, id: categoryId}))
        dispatch(setCategories([...categories, category]))
        setModal && setModal(false)
    }, setError, setActionLoading)
}

export const removeCategory = id => async (dispatch, getState) => {
    const state = getState().category
    const categories = state.categories
    const totalCount = state.totalCount

    await responseHandler(dispatch, async () => {
        await CategoryService.Delete(id)
        dispatch(setCategories(categories.filter(c => c.id !== id)))
        dispatch(setTotalCount(+totalCount - 1))
    }, setError, setDeleteLoading)

}

export const updateCategory = (setModal = null) => async (dispatch, getState)  => {
    const state = getState().category
    const category = state.category
    const categories = state.categories

    await responseHandler(dispatch, async () => {
        const index = categories.findIndex(x => x.id === category.id)
        await CategoryService.Update(category.id, category)
        categories[index] = category
        dispatch(setCategories([...categories]))
        setModal && setModal(false)
    }, setError, setActionLoading)
}