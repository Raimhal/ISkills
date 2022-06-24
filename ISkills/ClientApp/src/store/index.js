import {applyMiddleware, combineReducers, createStore} from "redux";
import {UserReducer} from "./UserReducer";
import {composeWithDevTools} from "redux-devtools-extension/developmentOnly";
import {CourseReducer} from "./CourseReducer";
import {CommentReducer} from "./CommentReducer";
import {ThemeReducer} from "./ThemeReducer";
import {CategoryReducer} from "./CategoryReducer";
import {ChapterReducer} from "./ChapterReducer";
import {VideoReducer} from "./VideoReducer";
import {FileReducer} from "./FileReducer";
import {BackupReducer} from "./BackupReducer";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
    user: UserReducer,
    course: CourseReducer,
    comment: CommentReducer,
    theme: ThemeReducer,
    category: CategoryReducer,
    chapter: ChapterReducer,
    video: VideoReducer,
    file: FileReducer,
    backup: BackupReducer
})

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

