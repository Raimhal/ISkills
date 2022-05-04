import defaultCourseImage from '../assets/images/defaultCourseImage.png'

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
    },
    params: {
        page: 1,
        skip: 0,
        take: 10,
        reverse: false,
        themeId: null,
        creatorId: null
    },
    sortList: [
        {name: 'Price', value: 'price'},
        {name: 'Language', value: 'language'},
        {name: 'Date', value: 'dateCreated'},
        {name: 'Rating', value: 'rating'},
    ],
    courses : [],
    totalCount: 0
}

const SET_COURSE = "SET_COURSE"
const CLEAR_COURSE = "CLEAR_COURSE"
const SET_COURSES = "SET_COURSES"
const CLEAR_COURSES = "CLEAR_COURSES"
const SET_PARAMS = "SET_PARAMS"
const CLEAR_PARAMS = "CLEAR_PARAMS"
const SET_TOTAL_COUNT = "SET_TOTAL_COUNT"
const CLEAR_TOTAL_COUNT = "CLEAR_TOTAL_COUNT"

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
