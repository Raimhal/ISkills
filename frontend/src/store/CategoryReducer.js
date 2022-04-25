

const defaultState = {
    category : {
        id: '',
        title: '',
    },
    categories : []
}

const SET_CATEGORY = "SET_CATEGORY"
const CLEAR_CATEGORY = "CLEAR_CATEGORY"
const SET_CATEGORIES = "SET_CATEGORIES"
const CLEAR_CATEGORIES = "CLEAR_CATEGORIES"

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
        default:
            return state
    }
}

export const setCategory = (payload) => ({type: SET_CATEGORY, payload: payload})
export const clearCategory = () => ({type: CLEAR_CATEGORY})
export const setCategories = (payload) => ({type: SET_CATEGORIES, payload: payload})
export const clearCategories = () => ({type: CLEAR_CATEGORIES})
