import defaultCourseImage from '../assets/images/defaultCourseImage.png'
import CourseService from "../API/CourseService";
import {responseHandler} from "./ResponseHandler";

const defaultState = {
    course : {
        id: '',
        title: '',
        shortInfo: '',
        requirements: '',
        description: '',
        language: '',
        price: 0,
        imageUrl: defaultCourseImage,
        categoryId: '',
        themeId: '',
        theme: {},
        students: [],
    },
    params: {
        page: 1,
        skip: 0,
        take: 10,
        reverse: false,
        themeId: null,
        creatorId: null,
        query: ''
    },
    sortList: [
        {name: 'Title', value: 'title'},
        {name: 'Price', value: 'price'},
        {name: 'Language', value: 'language'},
        {name: 'Date', value: 'dateCreated'},
        {name: 'Rating', value: 'rating'},
    ],
    courses : [],
    totalCount: 0,
    isLoading: false,
    error: null
}

const SET_COURSE = "SET_COURSE"
const CLEAR_COURSE = "CLEAR_COURSE"
const SET_COURSES = "SET_COURSES"
const CLEAR_COURSES = "CLEAR_COURSES"
const SET_PARAMS = "SET_COURSE_PARAMS"
const CLEAR_PARAMS = "CLEAR_COURSE_PARAMS"
const SET_TOTAL_COUNT = "SET_COURSE_TOTAL_COUNT"
const CLEAR_TOTAL_COUNT = "CLEAR_COURSE_TOTAL_COUNT"
const SET_LOADING = "SET_COURSE_LOADING"
const CLEAR_LOADING = "CLEAR_COURSE_LOADING"
const SET_ERROR = "SET_COURSE_ERROR"
const CLEAR_ERROR = "CLEAR_COURSE_ERROR"

export const CourseReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_COURSE:
            return {...state, course: action.payload}
        case SET_COURSES:
            return {...state, courses: action.payload}
        case CLEAR_COURSE:
            return {...state, course: defaultState.course}
        case CLEAR_COURSES:
            return {...state, courses: defaultState.courses}
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
        case SET_ERROR:
            return {...state, error: action.payload}
        case CLEAR_ERROR:
            return {...state, error: defaultState.error}
        default:
            return state
    }
}

export const setCourse = (payload) => ({type: SET_COURSE, payload: payload})
export const clearCourse = () => ({type: CLEAR_COURSE})
export const setCourses = (payload) => ({type: SET_COURSES, payload: payload})
export const clearCourses = () => ({type: CLEAR_COURSES})
export const setParams = (payload) => ({type: SET_PARAMS, payload: payload})
export const clearParams = () => ({type: CLEAR_PARAMS})
export const setTotalCount = (payload) => ({type: SET_TOTAL_COUNT, payload: payload})
export const clearTotalCount = () => ({type: CLEAR_TOTAL_COUNT})
export const setLoading = (payload) => ({type: SET_LOADING, payload: payload})
export const clearLoading = () => ({type: CLEAR_LOADING})
export const setError = (payload) => ({type: SET_ERROR, payload: payload})
export const clearError = () => ({type: CLEAR_ERROR})

export const getCourse = (id, navigate = null) => async (dispatch, getState) => {
    const error = getState().course.error

    await responseHandler(dispatch, async () => {
        const course = await CourseService.GetCourse(id)
        dispatch(setCourse({...course, categoryId: ''}))
    }, setError, setLoading)
    navigate && error && navigate('/404')

};

export const getCourses = () => async (dispatch, getState) => {
    const params = getState().course.params

    await responseHandler(dispatch, async () => {
        if (params.query === '')
            delete params.query
        const newParams = {
            ...params,
            skip: (params.page - 1) * params.take,
        }

        if(newParams.creatorId == null)
            delete newParams.creatorId

        if(newParams.themeId == null)
            delete newParams.themeId

        const [totalCount, newCourses] = await CourseService.GetCourses({
            params: newParams
        })
        dispatch(setParams(newParams))
        dispatch(setCourses(newCourses))
        dispatch(setTotalCount(+totalCount))
    }, setError, setLoading)
};

export const createCourse = (setModal = null, navigate = null) => async (dispatch, getState) => {
    const course = getState().course.course
    const courses = getState().course.courses
    const totalCount = getState().course.courses

    await responseHandler(dispatch, async () => {
        const courseId = await CourseSwervice.Create(course)
        dispatch(setCourses([...courses, {...course, id: courseId, rating: 0}]))
        setModal(false)
        dispatch(setTotalCount(+totalCount + 1))
        setModal && setModal(false)
        navigate && navigate(`/courses/${courseId}`)
    }, setError, setLoading)


}

export const removeCourse = id => async (dispatch, getState) => {
    const state = getState().course
    const courses = state.courses
    const totalCount = state.totalCount

    await responseHandler(dispatch, async () => {
        await CourseService.Delete(id)
        dispatch(setCourses(courses.filter(c => c.id !== id)))
        dispatch(setTotalCount(+totalCount - 1))
    }, setError, setLoading)

}

export const updateCourse = (setModal = null) => async (dispatch, getState)  => {
    const state = getState().course
    const course = state.course
    const courses = state.courses
    await responseHandler(dispatch, async () => {
        const index = courses.findIndex(x => x.id === course.id)
        await CourseService.Update(course.id, course)
        courses[index] = course
        dispatch(setCourses([...courses]))
        setModal && setModal(false)
    }, setError, setLoading)
}

export const updateImage = (setModal = null) => async (dispatch, getState) => {
    const state = getState().course
    const course = state.course
    const courses = state.courses
    await responseHandler(dispatch,async () => {
        const image = document.querySelector('#image').files[0]
        const url = await CourseService.UpdateImage(course.id, image, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        const index = courses.findIndex(x => x.id === course.id)
        dispatch(setCourse({...course, imageUrl: url}))
        courses[index] = {...courses[index], imageUrl: url}
        dispatch(setCourses(courses))
        setModal && setModal(false)
    }, setError, setLoading)

}


