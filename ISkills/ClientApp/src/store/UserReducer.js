import defaultUserImage from "../assets/images/defaultUserImage.png";
import UserService from "../API/UserService";
import {responseHandler} from "./ResponseHandler";
import jwt_decode from "jwt-decode";
import CourseService from "../API/CourseService";
import {setCourse} from "./CourseReducer";
import {setPurchases} from "./StatisticReducer";


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
    },
    totalCount: 0,
    params: {
        page: 1,
        skip: 0,
        take: 10,
        reverse: false,
        courseId: null
    },
    sortList: [
        {name: 'Email', value: 'email'},
        {name: 'Firstname', value: 'firstName'},
        {name: 'Lastname', value: 'lastName'},
        {name: 'Username', value: 'userName'},
        {name: 'Rating', value: 'rating'},
    ],
    isLoading: true,
    isActionLoading: false,
    isDeleteLoading: false,
    isImageLoading: false,
    isUsersLoading: false,
    error: null
}

const SET_TOKENS = "LOGIN_USER"
const SET_AUTH = "SET_AUTH"
const SET_USERS = "SET_USERS"
const CLEAR_USERS = "CLEAR_USERS"
const SET_USER = "SET_USER"
const CLEAR_USER = "CLEAR_USER"
const SET_IS_ADMIN  = "SET_IS_ADMIN"
const LOGOUT = "LOGOUT"
const SET_PARAMS = "SET_USER_PARAMS"
const CLEAR_PARAMS = "CLEAR_USER_PARAMS"
const SET_TOTAL_COUNT = "SET_USER_TOTAL_COUNT"
const CLEAR_TOTAL_COUNT = "CLEAR_USER_TOTAL_COUNT"
const SET_LOADING = "SET_USER_LOADING"
const CLEAR_LOADING = "CLEAR_USER_LOADING"
const SET_USERS_LOADING = "SET_USERS_LOADING"
const CLEAR_USERS_LOADING = "CLEAR_USERS_LOADING"
const SET_ERROR = "SET_USER_ERROR"
const SET_ACTION_LOADING = "SET_USER_ACTION_LOADING"
const CLEAR_ACTION_LOADING = "CLEAR_USER_ACTION_LOADING"
const SET_DELETE_LOADING = "SET_USER_DELETE_LOADING"
const CLEAR_DELETE_LOADING = "CLEAR_USER_DELETE_LOADING"
const SET_IMAGE_LOADING = "SET_USER_IMAGE_LOADING"
const CLEAR_IMAGE_LOADING = "CLEAR_USER_IMAGE_LOADING"
const CLEAR_ERROR = "CLEAR_USER_ERROR"

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
        case CLEAR_USER:
            return {...state, user: defaultState.user}
        case SET_IS_ADMIN:
            return {...state, isAdmin: action.payload}
        case LOGOUT:
            return {...state, user: defaultState.user, isAuth: defaultState.isAuth, isAdmin: defaultState.isAdmin}
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
        case SET_USERS_LOADING:
            return {...state, isUsersLoading: action.payload}
        case CLEAR_USERS_LOADING:
            return {...state, isUsersLoading: defaultState.isUsersLoading}
        case SET_ERROR:
            return {...state, error: action.payload}
        case CLEAR_ERROR:
            return {...state, error: defaultState.error}
        case SET_ACTION_LOADING:
            return {...state, isActionLoading: action.payload}
        case CLEAR_ACTION_LOADING:
            return {...state, isActionLoading: defaultState.isActionLoading}
        case SET_DELETE_LOADING:
            return {...state, isDeleteLoading: action.payload}
        case CLEAR_DELETE_LOADING:
            return {...state, isDeleteLoading: defaultState.isDeleteLoading}
        case SET_IMAGE_LOADING:
            return {...state, isImageLoading: action.payload}
        case CLEAR_IMAGE_LOADING:
            return {...state, isImageLoading: defaultState.isImageLoading}
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
export const setParams = (payload) => ({type: SET_PARAMS, payload: payload})
export const clearParams = () => ({type: CLEAR_PARAMS})
export const setTotalCount = (payload) => ({type: SET_TOTAL_COUNT, payload: payload})
export const clearTotalCount = () => ({type: CLEAR_TOTAL_COUNT})
export const setLoading = (payload) => ({type: SET_LOADING, payload: payload})
export const clearLoading = () => ({type: CLEAR_LOADING})
export const setUsersLoading = (payload) => ({type: SET_USERS_LOADING, payload: payload})
export const clearUsersLoading = () => ({type: CLEAR_USERS_LOADING})
export const setError = (payload) => ({type: SET_ERROR, payload: payload})
export const clearError = () => ({type: CLEAR_ERROR})
export const setActionLoading = (payload) => ({type: SET_ACTION_LOADING, payload: payload})
export const clearActionLoading = () => ({type: CLEAR_ACTION_LOADING})
export const setDeleteLoading = (payload) => ({type: SET_DELETE_LOADING, payload: payload})
export const clearDeleteLoading = () => ({type: CLEAR_DELETE_LOADING})
export const setImageLoading = (payload) => ({type: SET_IMAGE_LOADING, payload: payload})
export const clearImageLoading = () => ({type: CLEAR_IMAGE_LOADING})


export const login = (navigate) => async (dispatch, getState) => {
    const state = getState().user
    const user = state.user

    await responseHandler(dispatch, async () => {
        const data = await UserService.Login(user)
        localStorage.setItem('accessToken', data.jwtToken)
        dispatch(getCurrentUser())
        navigate('/')
    }, setError, setActionLoading)
}

export const logout = () => async (dispatch) => {
    await responseHandler(dispatch, async () => {
        localStorage.clear()
        dispatch(logoutUser())
        dispatch(clearUser())
    }, setError, setActionLoading)
}

export const assignUser = (navigate = null) => async (dispatch, getState) => {
    const currentUser = getState().user.user
    const course = getState().course.course
    const isAuth = getState().user.isAuth
    const purchases = getState().statistic.purchases

    if(!isAuth){
        navigate('/login')
        return
    }


    await responseHandler(dispatch, async () => {
        await CourseService.ToggleAssignment(course.id)

        purchases[purchases.length -1 ].count += 1
        dispatch(setPurchases([...purchases]))
        dispatch(setCourse({...course, students: [...course.students, currentUser]}))
        dispatch(setUser({...currentUser, courses: [...currentUser.courses, course]}))
    }, setError, setActionLoading)
}

export const getCurrentUser = () => async (dispatch) => {
    await responseHandler(dispatch, async () => {
        const currentUser = await UserService.getCurrentUser()
        dispatch(setUser(currentUser))
        dispatch(setIsAuth(true))
        dispatch(setIsAdmin(!!currentUser.roles?.some(x => x.name === "Admin")))
    }, setError, setLoading)
};

export const getUsers = (courseId = null) => async (dispatch, getState) => {
    const params = getState().user.params

    await responseHandler(dispatch, async () => {
        if (params.query === '')
            delete params.query
        const newParams = {
            ...params,
            skip: (params.page - 1) * params.take,
            courseId: courseId
        }

        const [totalCount, newUsers] = await UserService.GetUsers({
            params: newParams
        })

        dispatch(setParams(newParams))
        dispatch(setUsers(newUsers))
        dispatch(setTotalCount(+totalCount))
    }, setError, setUsersLoading)
};

export const createUser = (navigate = null) => async (dispatch, getState) => {
    const state = getState().user
    const user = state.user

    await responseHandler(dispatch, async () => {
        const userId = await UserService.Create(user)
        dispatch(setUser({...user, id: userId}))
        navigate('/login')
    }, setError, setActionLoading)
}

export const removeUser = id => async (dispatch, getState) => {
    const state = getState().user
    const users = state.users
    const totalCount = state.totalCount

    await responseHandler(dispatch, async () => {
        await UserService.Delete(id)
        dispatch(setUsers(users.filter(c => c.id !== id)))
        dispatch(setTotalCount(+totalCount - 1))
    }, setError, setDeleteLoading)

}

export const updateUser = (setModal = null) => async (dispatch, getState)  => {
    const state = getState().user
    const user = state.user
    const users = state.users
    await responseHandler(dispatch, async () => {
        const index = users.findIndex(x => x.id === user.id)
        await UserService.Update(user.id, user)
        users[index] = user
        dispatch(setUsers([...users]))
        setModal && setModal(false)
    }, setError, setActionLoading)
}

export const updateImage = (setModal = null) => async (dispatch, getState) => {
    const state = getState().user
    const user = state.user
    const users = state.users
    await responseHandler(dispatch,async () => {
        const image = document.querySelector('#image').files[0]
        const url = await UserService.UpdateUserImage(user.id, image, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        const index = users.findIndex(x => x.id === user.id)
        dispatch(setUser({...user, imageUrl: url}))
        users[index] = {...users[index], imageUrl: url}
        dispatch(setUsers(users))
        setModal && setModal(false)
    }, setError, setImageLoading)
}

