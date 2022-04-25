import {combineReducers, createStore} from "redux";
import {UserReducer} from "./UserReducer";
import {composeWithDevTools} from "redux-devtools-extension";
import {CourseReducer} from "./CourseReducer";
import {CommentReducer} from "./CommentReducer";
import {ThemeReducer} from "./ThemeReducer";
import {CategoryReducer} from "./CategoryReducer";
import {ChapterReducer} from "./ChapterReducer";
import {VideoReducer} from "./VideoReducer";

const rootReducer = combineReducers({
    user: UserReducer,
    course: CourseReducer,
    comment: CommentReducer,
    theme: ThemeReducer,
    category: CategoryReducer,
    chapter: ChapterReducer,
    video: VideoReducer
})

export const store = createStore(rootReducer, composeWithDevTools())