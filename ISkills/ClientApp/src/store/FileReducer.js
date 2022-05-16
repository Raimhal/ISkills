import {responseHandler} from "./ResponseHandler";
import FileService from "../API/FileService";

const defaultState = {
    types: [],
    type: {
        fileType: '',
        fileSize: 0,
    },
    totalCount: 0,
    params: {
        page: 1,
        skip: 0,
        take: 10,
        reverse: false,
    },
    sortList: [
        {name: 'Type', value: 'fileType'},
        {name: 'Size', value: 'fileSize'},
    ],
    isLoading: false,
    error: null
}

const SET_TYPES = "SET_TYPES"
const CLEAR_TYPES = "CLEAR_TYPES"
const SET_TYPE = "SET_TYPE"
const CLEAR_TYPE = "CLEAR_TYPE"
const SET_PARAMS = "SET_TYPE_PARAMS"
const CLEAR_PARAMS = "CLEAR_TYPE_PARAMS"
const SET_TOTAL_COUNT = "SET_TYPE_TOTAL_COUNT"
const CLEAR_TOTAL_COUNT = "CLEAR_TYPE_TOTAL_COUNT"
const SET_LOADING = "SET_TYPE_LOADING"
const CLEAR_LOADING = "CLEAR_TYPE_LOADING"
const SET_ERROR = "SET_TYPE_ERROR"
const CLEAR_ERROR = "CLEAR_TYPE_ERROR"


export const FileReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_TYPES:
            return {...state, types: action.payload}
        case CLEAR_TYPES:
            return {...state, types: defaultState.types}
        case SET_TYPE:
            return {...state, type: action.payload}
        case CLEAR_TYPE:
            return {...state, type: defaultState.types}
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

export const setFileTypes = (payload) => ({type: SET_TYPES, payload: payload})
export const setFileType = (payload) => ({type: SET_TYPE, payload: payload})
export const clearFileTypes = () => ({type: CLEAR_TYPES})
export const clearFileType = () => ({type: CLEAR_TYPE})
export const setParams = (payload) => ({type: SET_PARAMS, payload: payload})
export const clearParams = () => ({type: CLEAR_PARAMS})
export const setTotalCount = (payload) => ({type: SET_TOTAL_COUNT, payload: payload})
export const clearTotalCount = () => ({type: CLEAR_TOTAL_COUNT})
export const setLoading = (payload) => ({type: SET_LOADING, payload: payload})
export const clearLoading = () => ({type: CLEAR_LOADING})
export const setError = (payload) => ({type: SET_ERROR, payload: payload})
export const clearError = () => ({type: CLEAR_ERROR})


export const getFileTypes = () => async (dispatch, getState) => {
    const params = getState().file.params

    await responseHandler(dispatch, async () => {
        if (params.query === '')
            delete params.query
        const newParams = {
            ...params,
            skip: (params.page - 1) * params.take,
        }
        const [totalCount, newTypes] = await FileService.GetFileTypes({
            params: newParams
        })
        dispatch(setParams(newParams))
        dispatch(setFileTypes(newTypes))
        dispatch(setTotalCount(+totalCount))
    }, setError, setLoading)
};

export const createType = (setModal = null) => async (dispatch, getState) => {
    const state = getState().file
    const type = state.type

    await responseHandler(dispatch, async () => {
        const typeId = await FileService.Create(type)
        dispatch(setFileType({...type, id: typeId}))
        setModal && setModal(false)
    }, setError, setLoading)
}

export const removeType = id => async (dispatch, getState) => {
    const state = getState().file
    const types = state.types
    const totalCount = state.totalCount

    await responseHandler(dispatch, async () => {
        await FileService.Delete(id)
        dispatch(setFileTypes(types.filter(c => c.id !== id)))
        dispatch(setTotalCount(+totalCount - 1))
    }, setError, setLoading)

}

export const updateType = (setModal = null) => async (dispatch, getState)  => {
    const state = getState().file
    const type = state.type
    const types = state.types
    await responseHandler(dispatch, async () => {
        const index = types.findIndex(x => x.id === type.id)
        await FileService.Update(type.id, type)
        types[index] = type
        dispatch(setFileTypes([...types]))
        setModal && setModal(false)
    }, setError, setLoading)
}