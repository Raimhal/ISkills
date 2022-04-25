import defaultUserImage from "../assets/images/defaultUserImage.png";


const defaultState = {
    isAuth: false,
    isAdmin: false,
    users: [],
    user: {
        email: "",
        password: "",
        firstName: '',
        lastName: '',
        userName: '',
        confirmPassword: '',
        imageUrl: defaultUserImage,
        rating: 0
    }
}

const SET_TOKENS = "LOGIN_USER"
const SET_AUTH = "SET_AUTH"
const SET_USERS = "SET_USERS"
const CLEAR_USERS = "CLEAR_USERS"
const SET_USER = "SET_USER"
const CLEAR_USER = "CLEAR_USER"
const SET_IS_ADMIN  = "SET_IS_ADMIN"
const LOGOUT = "LOGOUT"

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
        case SET_USER:
            return {...state, user: action.payload}
        case SET_IS_ADMIN:
            return {...state, isAdmin: action.payload}
        case LOGOUT:
            return {...state, user: defaultState.user, isAuth: defaultState.isAuth, isAdmin: defaultState.isAdmin}
        default:
            return state
    }
}

export const setTokens = (payload) => ({type: SET_TOKENS, payload: payload})
export const setIsAuth = (payload) => ({type: SET_AUTH, payload: payload})
export const setIsAdmin = (payload) => ({type: SET_IS_ADMIN, payload: payload})
export const setUsers = (payload) => ({type: SET_USERS, payload: payload})
export const setUser = (payload) => ({type: SET_USER, payload: payload})
export const clearUsers = () => ({type: CLEAR_USERS})
export const clearUser = () => ({type: CLEAR_USER})
export const logoutUser = () => ({type: LOGOUT})