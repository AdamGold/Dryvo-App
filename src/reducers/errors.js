import { ERROR, TRUNCATE_ERROR } from "./consts"
import { DEFAULT_ERROR } from "../consts"

export default function errorReducer(state = "", action) {
	switch (action.type) {
		case ERROR:
			if (!action.hasOwnProperty("error")) {
				action.error = DEFAULT_ERROR
			}
			return action.error
		case TRUNCATE_ERROR:
			return ""
		default:
			return state
	}
}
