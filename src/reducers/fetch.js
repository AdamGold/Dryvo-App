import * as consts from "./consts"
import Fetch from "../services/Fetch"

export default function fetchServiceReducer(state = null, action) {
	switch (action.type) {
		case consts.LOAD_FETCH_SERVICE:
			return new Fetch()
		default:
			return state
	}
}
