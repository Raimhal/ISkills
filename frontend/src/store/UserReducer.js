

const defaultState = {
    isAuth: false,
    tokens: {}
}

const SET_TOKENS = "LOGIN_USER"
const SET_AUTH = "SET_AUTH"

export const UserReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_TOKENS:
            return {...state, tokens: action.payload}
        case SET_AUTH:
            return {...state, isAuth: action.payload}
        default:
            return state
    }
}

export const setTokens = (payload) => ({type: SET_TOKENS, payload: payload})
export const setIsAuth = (payload) => ({type: SET_AUTH, payload: payload})