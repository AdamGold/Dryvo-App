import { combineReducers } from "redux"
import userReducer from "./user"
import fetchServiceReducer from "./fetch"
import errorReducer from "./errors"

const appReducer = combineReducers({
	user: userReducer,
	fetchService: fetchServiceReducer,
	error: errorReducer
})
export default appReducer
