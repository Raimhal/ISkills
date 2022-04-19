

const defaultState = {
    course : {
        id: '',
        title: '',
        shortInfo: '',
        requirements: '',
        description: '',
        language: '',
        price: null,
        imageUrl: "defaultCourseImage.png",
        categoryId: '',
        themeId: '',
        theme: {},
    },
    courses : []
}

const SET_COURSE = "SET_COURSE"
const CLEAR_COURSE = "CLEAR_COURSE"
const SET_COURSES = "SET_COURSES"
const CLEAR_COURSES = "CLEAR_COURSES"

export const CourseReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_COURSE:
            return {...state, course: action.payload}
        case SET_COURSES:
            return {...state, courses: action.payload}
        case CLEAR_COURSE:
            return {...state, course: defaultState.course}
        case CLEAR_COURSES:
            return {...state, course: defaultState.courses}
        default:
            return state
    }
}

export const setCourse = (payload) => ({type: SET_COURSE, payload: payload})
export const clearCourse = () => ({type: CLEAR_COURSE, payload: null})
export const setCourses = (payload) => ({type: SET_COURSES, payload: payload})
export const clearCourses = () => ({type: CLEAR_COURSES, payload: null})
