

const defaultState = {
    isAuth: false,
    tokens: {},
    users: []
}

const SET_TOKENS = "LOGIN_USER"
const SET_AUTH = "SET_AUTH"
const SET_USERS = "SET_USERS"
const CLEAR_USERS = "CLEAR_USERS"

export const UserReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_TOKENS:
            return {...state, tokens: action.payload}
        case SET_AUTH:
            return {...state, isAuth: action.payload}
        case SET_USERS:
            return {...state, users: action.payload}
        case CLEAR_USERS:
            return {...state, users: defaultState.users}
        default:
            return state
    }
}

export const setTokens = (payload) => ({type: SET_TOKENS, payload: payload})
export const setIsAuth = (payload) => ({type: SET_AUTH, payload: payload})
export const setUsers = (payload) => ({type: SET_USERS, payload: payload})
export const clearUsers = () => ({type: CLEAR_USERS, payload: null})