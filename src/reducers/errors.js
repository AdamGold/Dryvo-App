import { API_ERROR, POP_ERROR } from "./consts"
import { APIError } from "../error_handling"

apiClassName = APIError.name

initialErrors = {
	[apiClassName]: [],
	other: []
} // more errors to come

export default function errorsReducer(state = initialErrors, action) {
	switch (action.type) {
		case API_ERROR:
			return Object.assign({}, state, {
				[apiClassName]: [...state[apiClassName], action.error]
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
