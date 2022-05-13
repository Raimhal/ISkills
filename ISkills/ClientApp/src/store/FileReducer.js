
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
}

const SET_TYPES = "SET_TYPES"
const CLEAR_TYPES = "CLEAR_TYPES"
const SET_TYPE = "SET_TYPE"
const CLEAR_TYPE = "CLEAR_TYPE"
const SET_PARAMS = "SET_PARAMS"
const CLEAR_PARAMS = "CLEAR_PARAMS"
const SET_TOTAL_COUNT = "SET_TOTAL_COUNT"
const CLEAR_TOTAL_COUNT = "CLEAR_TOTAL_COUNT"

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