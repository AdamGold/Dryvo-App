import { API_ERROR, POP_ERROR } from "./consts"
import { updateObject } from "./utils"

initialErrors = {
	[API_ERROR]: [],
	other: []
} // more errors to come

export default function errorsReducer(state = initialErrors, action) {
	switch (action.type) {
		case API_ERROR:
			return updateObject(state, {
				[API_ERROR]: [...state[API_ERROR], action.error]
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
