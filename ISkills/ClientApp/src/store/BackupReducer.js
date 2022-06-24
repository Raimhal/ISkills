import {responseHandler} from "./ResponseHandler";
import BackupService from "../API/BackupService";


const defaultState = {
    backup: {},
    backups: [],
    totalCount: 0,
    params: {
        page: 1,
        skip: 0,
        take: 10,
    },
    isLoading: false,
    isActionLoading: false,
    idDeleteLoading: false,
    error: null
}

const SET_BACKUP = "SET_BACKUP"
const CLEAR_BACKUP = "CLEAR_BACKUP"
const SET_BACKUPS = "SET_BACKUPS"
const CLEAR_BACKUPS = "CLEAR_BACKUPS"
const SET_PARAMS = "SET_BACKUP_PARAMS"
const CLEAR_PARAMS = "CLEAR_BACKUP_PARAMS"
const SET_TOTAL_COUNT = "SET_BACKUP_TOTAL_COUNT"
const CLEAR_TOTAL_COUNT = "CLEAR_BACKUP_TOTAL_COUNT"
const SET_LOADING = "SET_BACKUP_LOADING"
const CLEAR_LOADING = "CLEAR_BACKUP_LOADING"
const SET_ACTION_LOADING = "SET_BACKUP_ACTION_LOADING"
const CLEAR_ACTION_LOADING = "CLEAR_BACKUP_ACTION_LOADING"
const SET_DELETE_LOADING = "SET_BACKUP_DELETE_LOADING"
const CLEAR_DELETE_LOADING = "CLEAR_BACKUP_DELETE_LOADING"
const SET_ERROR = "SET_BACKUP_ERROR"
const CLEAR_ERROR = "CLEAR_BACKUP_ERROR"

export const BackupReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_BACKUP:
            return {...state, backup: action.payload}
        case CLEAR_BACKUP:
            return {...state, backup: defaultState.backup}
        case SET_BACKUPS:
            return {...state, backups: action.payload}
        case CLEAR_BACKUPS:
            return {...state, backups: defaultState.backups}
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
        case SET_ACTION_LOADING:
            return {...state, isActionLoading: action.payload}
        case CLEAR_ACTION_LOADING:
            return {...state, isActionLoading: defaultState.isLoading}
        case SET_DELETE_LOADING:
            return {...state, isDeleteLoading: action.payload}
        case CLEAR_DELETE_LOADING:
            return {...state, isDeleteLoading: defaultState.isLoading}
        case SET_ERROR:
            return {...state, error: action.payload}
        case CLEAR_ERROR:
            return {...state, error: defaultState.error}
        default:
            return state
    }
}

export const setBackup = (payload) => ({type: SET_BACKUP, payload: payload})
export const clearBackup = () => ({type: CLEAR_BACKUP})
export const setBackups = (payload) => ({type: SET_BACKUPS, payload: payload})
export const setParams = (payload) => ({type: SET_PARAMS, payload: payload})
export const clearParams = () => ({type: CLEAR_PARAMS})
export const setTotalCount = (payload) => ({type: SET_TOTAL_COUNT, payload: payload})
export const setLoading = (payload) => ({type: SET_LOADING, payload: payload})
export const clearLoading = () => ({type: CLEAR_LOADING})
export const setActionLoading = (payload) => ({type: SET_ACTION_LOADING, payload: payload})
export const clearActionLoading = () => ({type: CLEAR_ACTION_LOADING})
export const setDeleteLoading = (payload) => ({type: SET_DELETE_LOADING, payload: payload})
export const clearDeleteLoading = () => ({type: CLEAR_DELETE_LOADING})
export const setError = (payload) => ({type: SET_ERROR, payload: payload})
export const clearError = () => ({type: CLEAR_ERROR})

export const createBackup = () => async(dispatch, getState) => {
    const totalCount = getState().backup.totalCount
    const backups = getState().backup.backups

    await responseHandler(dispatch, async () => {
        const url = (await BackupService.CreateBackup()).toString()

        const separatedUrl = url.split("/")
        const fileName = separatedUrl[separatedUrl.length - 1]

        let created = fileName.replace("Backup_", "").replace(".sql", "")
        const [date, time] = created.split("_")
        created = `${date.split("-").reverse().join(".")}, ${time.replace("-", ":").replace("-", ":")}`

        const backup = {id: url, url: url, created: created, fileName: fileName}
        dispatch(setBackups([backup, ...backups]))
        dispatch(setTotalCount(+totalCount + 1))
    }, setError, setActionLoading)
}

export const executeRestore = (setModal = null) => async(dispatch, getState) => {
    const backup = getState().backup.backup
    console.log(backup);

    await responseHandler(dispatch, async () => {
        await BackupService.ExecuteRestore({
            params: {
                backupUrl: backup.url
            }
        })
        setModal && setModal(false)
    }, setError, setActionLoading)
}

export const getBackups = () => async (dispatch, getState) => {
    const params = getState().backup.params

    await responseHandler(dispatch, async () => {
        const newParams = {
            ...params,
            skip: (params.page - 1) * params.take
        }

        const [totalCount, newBackups] = await BackupService.GetBackups({
            params: newParams
        })

        dispatch(setParams(newParams))
        dispatch(setBackups([...newBackups]))
        dispatch(setTotalCount(+totalCount))
    }, setError, setLoading)
};

export const removeBackup = url => async (dispatch, getState) => {
    const backups = getState().backup.backups
    const totalCount = getState().backup.totalCount

    await responseHandler(dispatch, async () => {
        await BackupService.Delete(url)
        dispatch(setBackups([...backups.filter(b => b.url !== url)]))
        dispatch(setTotalCount(+totalCount - 1))
    }, setError, setDeleteLoading)
}
