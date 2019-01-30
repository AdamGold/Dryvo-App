import { LOGIN, LOGOUT } from "./consts"

export default function userReducer(state = null, action) {
	switch (action.type) {
		case LOGIN:
			return action.user
		case LOGOUT:
			return null
		default:
			return state
	}
}
