import { LOAD_FETCH_SERVICE } from "./consts"
import Fetch from "../services/Fetch"

export default function fetchServiceReducer(state = null, action) {
	switch (action.type) {
		case LOAD_FETCH_SERVICE:
			return new Fetch()
		default:
			return state
	}
}
