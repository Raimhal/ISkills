import {combineReducers, createStore} from "redux";
import {UserReducer} from "./UserReducer";
import {composeWithDevTools} from "redux-devtools-extension";
import {CourseReducer} from "./CourseReducer";
import {CommentReducer} from "./CommentReducer";

const rootReducer = combineReducers({
    user: UserReducer,
    course: CourseReducer,
    comment: CommentReducer
})

export const store = createStore(rootReducer, composeWithDevTools())