

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
        sortOption: 'title'
    },
    sortList: [
        {name: 'Id', value: 'id'},
        {name: 'title', value: 'id'},
    ],
}

const SET_CATEGORY = "SET_CATEGORY"
const CLEAR_CATEGORY = "CLEAR_CATEGORY"
const SET_CATEGORIES = "SET_CATEGORIES"
const CLEAR_CATEGORIES = "CLEAR_CATEGORIES"
const SET_PARAMS = "SET_PARAMS"
const CLEAR_PARAMS = "CLEAR_PARAMS"
const SET_TOTAL_COUNT = "SET_TOTAL_COUNT"
const CLEAR_TOTAL_COUNT = "CLEAR_TOTAL_COUNT"

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