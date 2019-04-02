import { LOGIN, LOGOUT, CHANGE_USER_IMAGE } from "./consts"

export default function userReducer(state = null, action) {
	switch (action.type) {
		case LOGIN:
			return action.user
		case LOGOUT:
			return null
		case CHANGE_USER_IMAGE:
			return { ...state, image: action.image }
		default:
			return state
	}
}
