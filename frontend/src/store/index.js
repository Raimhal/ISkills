import {combineReducers, createStore} from "redux";
import {UserReducer} from "./UserReducer";
import {composeWithDevTools} from "redux-devtools-extension";

const rootReducer = combineReducers({
    user: UserReducer
})

export const store = createStore(rootReducer, composeWithDevTools())