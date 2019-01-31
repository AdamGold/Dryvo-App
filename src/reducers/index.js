import { combineReducers } from "redux"
import userReducer from "./user"
import fetchServiceReducer from "./fetch"
import errorsReducer from "./errors"

const appReducer = combineReducers({
	user: userReducer,
	fetchService: fetchServiceReducer,
	errors: errorsReducers
})
export default appReducer
