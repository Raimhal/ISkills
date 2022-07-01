import {responseHandler} from "./ResponseHandler";
import CommentService from "../API/CommentService";
import {setComments} from "./CommentReducer";
import PurchaseService from "../API/PurchaseService";
import {forEach} from "react-bootstrap/ElementChildren";


const defaultState = {
    purchases: [],
    clientToken: null,
    totalCount: 0,
    params: {
        page: 1,
        skip: 0,
        take: 10,
        reverse: false,
        sortOption: "date",
        days: 10
    },
    isLoading: true,
    isClientTokenLoading: true,
    error: null
}

const SET_PURCHASES = "SET_PURCHASES"
const CLEAR_PURCHASES = "CLEAR_PURCHASES"
const SET_CLIENT_TOKEN = "SET_CLIENT_TOKEN"
const CLEAR_CLIENT_TOKEN = "CLEAR_CLIENT_TOKEN"
const SET_PARAMS = "SET_PURCHASE_PARAMS"
const CLEAR_PARAMS = "CLEAR_PURCHASE_PARAMS"
const SET_LOADING = "SET_PURCHASE_LOADING"
const CLEAR_LOADING = "CLEAR_PURCHASE_LOADING"
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
            return {...state, isLoading: defaultState.isLoading}
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
export const setClientToken = (payload) => ({type: SET_CLIENT_TOKEN, payload: payload})
export const clearClientToken = () => ({type: CLEAR_CLIENT_TOKEN})
export const setParams = (payload) => ({type: SET_PARAMS, payload: payload})
export const clearParams = () => ({type: CLEAR_PARAMS})
export const setLoading = (payload) => ({type: SET_LOADING, payload: payload})
export const clearLoading = () => ({type: CLEAR_LOADING})
export const setClientTokenLoading = (payload) => ({type: SET_CLIENT_TOKEN_LOADING, payload: payload})
export const clearClientTokenLoading = () => ({type: CLEAR_CLIENT_TOKEN_LOADING})
export const setError = (payload) => ({type: SET_ERROR, payload: payload})
export const clearError = () => ({type: CLEAR_ERROR})


export const getPurchasesStatistic = (courseId = null) => async (dispatch, getState) => {
    const params = getState().purchase.params

    await responseHandler(dispatch, async () => {
        const today = new Date()
        const startDate = new Date()
        startDate.setDate(today.getDate() - params.days)

        const newParams = {
            ...params,
            courseId: courseId,
            startDate: startDate.toLocaleDateString().split(".").reverse().join("-"),
            endDate: today.toLocaleDateString().split(".").reverse().join("-")
        }

        const purchases = await PurchaseService.GetPurchasesPurchase({
            params: newParams
        })
        const list = []

        for(let i = 0; i < params.days; i++){

            let item
            purchases.forEach(purchase => {
                if((new Date(purchase.name).toLocaleDateString() === new Date(today).toLocaleDateString())){
                    item = purchase
                }

            })

            if(!item)
                item = {name: new Date(today), count: 0}

            list.push(item)
            today.setDate(today.getDate() - 1)
        }


        dispatch(setParams(newParams))
        dispatch(setPurchases([...list.reverse()]))
    }, setError, setLoading)
};

export const generateClientToken = () => async (dispatch, getState) => {
    await responseHandler(dispatch, async () => {
        const clientToken = await PurchaseService.GenerateClientToken()
        dispatch(setClientToken(clientToken))
    }, setError, setClientTokenLoading)
}


