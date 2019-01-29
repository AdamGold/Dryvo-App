import { combineReducers } from "redux"
import userReducer from "./user"
import fetchServiceReducer from "./fetch"

const appReducer = combineReducers({
	user: userReducer,
	fetchService: fetchServiceReducer
})
export default appReducer
