import {responseHandler} from "./ResponseHandler";
import CommentService from "../API/CommentService";
import {setComments} from "./CommentReducer";
import PurchaseService from "../API/PurchaseService";
import {forEach} from "react-bootstrap/ElementChildren";
import moment from 'moment';


const defaultState = {
    purchases: [],
    yearPurchases: [],
    clientToken: null,
    totalCount: 0,
    params: {
        page: 1,
        skip: 0,
        take: 10,
        reverse: false,
        sortOption: "date",
        days: 14,
        year: new Date().getFullYear()
    },
    isLoading: true,
    isYearLoading: true,
    isClientTokenLoading: true,
    error: null
}

const SET_PURCHASES = "SET_PURCHASES"
const CLEAR_PURCHASES = "CLEAR_PURCHASES"
const SET_YEAR_PURCHASES = "SET_YEAR_PURCHASES"
const CLEAR_YEAR_PURCHASES = "CLEAR_YEAR_PURCHASES"
const SET_CLIENT_TOKEN = "SET_CLIENT_TOKEN"
const CLEAR_CLIENT_TOKEN = "CLEAR_CLIENT_TOKEN"
const SET_PARAMS = "SET_PURCHASE_PARAMS"
const CLEAR_PARAMS = "CLEAR_PURCHASE_PARAMS"
const SET_LOADING = "SET_PURCHASE_LOADING"
const CLEAR_LOADING = "CLEAR_PURCHASE_LOADING"
const SET_YEAR_LOADING = "SET_YEAR_PURCHASE_LOADING"
const CLEAR_YEAR_LOADING = "CLEAR_YEAR_PURCHASE_LOADING"
const SET_CLIENT_TOKEN_LOADING = "SET_CLIENT_TOKEN_LOADING"
const CLEAR_CLIENT_TOKEN_LOADING = "CLEAR_CLIENT_TOKEN_LOADING"
const SET_ERROR = "SET_PURCHASE_ERROR"
const CLEAR_ERROR = "CLEAR_PURCHASE_ERROR"

export const PurchaseReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_PURCHASES:
            return {...state, purchases: action.payload}
        case CLEAR_PURCHASES:
            return {...state, purchases: defaultState.purchases}
        case SET_YEAR_PURCHASES:
            return {...state, yearPurchases: action.payload}
        case CLEAR_YEAR_PURCHASES:
            return {...state, yearPurchases: defaultState.yearPurchases}
        case SET_CLIENT_TOKEN:
            return {...state, clientToken: action.payload}
        case CLEAR_CLIENT_TOKEN:
            return {...state, clientToken: defaultState.clientToken}
        case SET_PARAMS:
            return {...state, params: action.payload}
        case CLEAR_PARAMS:
            return {...state, params: defaultState.params}
        case SET_LOADING:
            return {...state, isLoading: action.payload}
        case CLEAR_LOADING:
            return {...state, isYearLoading: defaultState.isLoading}
        case SET_YEAR_LOADING:
            return {...state, isYearLoading: action.payload}
        case CLEAR_YEAR_LOADING:
            return {...state, isLoading: defaultState.isYearLoading}
        case SET_CLIENT_TOKEN_LOADING:
            return {...state, isClientTokenLoading: action.payload}
        case CLEAR_CLIENT_TOKEN_LOADING:
            return {...state, isClientTokenLoading: defaultState.isClientTokenLoading}
        case SET_ERROR:
            return {...state, error: action.payload}
        case CLEAR_ERROR:
            return {...state, error: defaultState.error}
        default:
            return state
    }
}

export const setPurchases = (payload) => ({type: SET_PURCHASES, payload: payload})
export const clearPurchases = () => ({type: CLEAR_PURCHASES})
export const setYearPurchases = (payload) => ({type: SET_YEAR_PURCHASES, payload: payload})
export const clearYearPurchases = () => ({type: CLEAR_YEAR_PURCHASES})
export const setClientToken = (payload) => ({type: SET_CLIENT_TOKEN, payload: payload})
export const clearClientToken = () => ({type: CLEAR_CLIENT_TOKEN})
export const setParams = (payload) => ({type: SET_PARAMS, payload: payload})
export const clearParams = () => ({type: CLEAR_PARAMS})
export const setLoading = (payload) => ({type: SET_LOADING, payload: payload})
export const clearLoading = () => ({type: CLEAR_LOADING})
export const setYearLoading = (payload) => ({type: SET_YEAR_LOADING, payload: payload})
export const clearYearLoading = () => ({type: CLEAR_YEAR_LOADING})
export const setClientTokenLoading = (payload) => ({type: SET_CLIENT_TOKEN_LOADING, payload: payload})
export const clearClientTokenLoading = () => ({type: CLEAR_CLIENT_TOKEN_LOADING})
export const setError = (payload) => ({type: SET_ERROR, payload: payload})
export const clearError = () => ({type: CLEAR_ERROR})


export const getPurchasesStatistic = (courseId = null) => async (dispatch, getState) => {
    const params = getState().purchase.params

    await responseHandler(dispatch, async () => {
        const date = new Date()
        const startDate = new Date()
        startDate.setDate(date.getDate() - params.days)

        const newParams = {
            ...params,
            courseId: courseId,
            startDate: startDate.toLocaleDateString().split(".").reverse().join("-"),
            endDate: date.toLocaleDateString().split(".").reverse().join("-")
        }

        const purchases = await PurchaseService.GetPurchasesStatistic({
            params: newParams
        })
        const list = []

        for(let i = 0; i < params.days; i++){

            let item = purchases.find(purchase => new Date(purchase.day).toLocaleDateString() === date.toLocaleDateString())
            if(!item)
                item = {amount: 0}
            list.push({day: moment(date).format("LL"), amount: item.amount})
            date.setDate(date.getDate() - 1)
        }
        dispatch(setParams(newParams))
        dispatch(setPurchases([...list.reverse()]))
    }, setError, setLoading)
};

export const getYearPurchasesStatistic = (courseId = null) => async (dispatch, getState) => {
    const params = getState().purchase.params
    const months = moment.months()

    await responseHandler(dispatch, async () => {
        // dispatch(clearYearPurchases())

        const newParams = {
            ...params,
            courseId: courseId,
        }

        const purchases = await PurchaseService.GetYearPurchasesStatistic({
            params: newParams
        })
        const list = []


        for(let i = 0; i < months.length; i++){
            let item = purchases.find(x => +x.month === i + 1)
            if(!item)
                item = {amount: 0}

            if(item)
                list.push({month: months[i], amount: item.amount})

        }

        dispatch(setParams(newParams))
        dispatch(setYearPurchases([...list]))
    }, setError, setYearLoading)
};

export const generateClientToken = () => async (dispatch, getState) => {
    await responseHandler(dispatch, async () => {
        const clientToken = await PurchaseService.GenerateClientToken()
        dispatch(setClientToken(clientToken))
    }, setError, setClientTokenLoading)
}


