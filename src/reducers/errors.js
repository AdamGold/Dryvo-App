import { API_ERROR, POP_ERROR, APP_ERROR } from "./consts"
import { DEFAULT_ERROR } from "../consts"
import { updateObject } from "./utils"

export const initialErrors = {
	[API_ERROR]: [],
	[APP_ERROR]: [],
	other: []
} // more errors to come

export default function errorsReducer(state = initialErrors, action) {
	switch (action.type) {
		case API_ERROR:
			if (action.error == "") {
				action.error = DEFAULT_ERROR
			}
			return updateObject(state, {
				[API_ERROR]: [...state[API_ERROR], action.error]
			})
		case APP_ERROR:
			if (action.error == "") {
				action.error = DEFAULT_ERROR
			}
			return updateObject(state, {
				[APP_ERROR]: [...state[APP_ERROR], action.error]
			})
		case POP_ERROR:
			// pop one of the arrays (action.errorType)
			const afterLastPopped = state[action.errorType].filter(
				(v, i) => i != state[action.errorType].length - 1
			) // take all but last
			return Object.assign({}, state, {
				[action.errorType]: afterLastPopped
			})
		default:
			return state
	}
}
