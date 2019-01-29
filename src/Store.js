import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import rootReducer from "./reducers"
import { composeWithDevTools } from "remote-redux-devtools"

export default function configureStore() {
	return createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))
}
