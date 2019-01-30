import { ROOT_URL, TOKEN_KEY, REFRESH_TOKEN_KEY } from "../consts"
import { Linking } from "react-native"
import Storage from "../services/Storage"
import { LOGIN, LOGOUT } from "../reducers/consts"

export const directLogin = (email, password, callback) => {
	return async (dispatch, getState) => {
		const { fetchService } = getState()
		resp = await fetchService.fetch("/login/direct", {
			method: "POST",
			body: JSON.stringify({
				email,
				password
			})
		})
		if (resp.status != 200) {
			let msg = "Error occured."
			if (resp.json.hasOwnProperty("message")) msg = resp.json.message
			callback(msg)
			return
		}
		setTokens(resp.json.auth_token, resp.json.refresh_token)
		dispatch(setUser(resp.json.user))
		callback(resp.json.user)
	}
}

export const register = (params, callback) => {
	return async (dispatch, getState) => {
		const { fetchService } = getState()
		resp = await fetchService.fetch("/login/register", {
			method: "POST",
			body: JSON.stringify(params)
		})
		if (resp.status != 201) {
			let msg = "Error occured."
			if (resp.json.hasOwnProperty("message")) msg = resp.json.message
			callback(msg)
			return
		}
		setTokens(resp.json.auth_token, resp.json.refresh_token)
		dispatch(setUser(resp.json.user))
		callback(resp.json.user)
	}
}

const setTokens = (token, refresh_token) => {
	Storage.setItem(TOKEN_KEY, token, true)
	Storage.setItem(REFRESH_TOKEN_KEY, refresh_token, true)
}

const setUser = user => {
	return dispatch => {
		dispatch({ type: LOGIN, user: user })
	}
}

export const logout = (callback = () => {}) => {
	return dispatch => {
		console.log("Logging out")
		Storage.removeItem(TOKEN_KEY, true)
		Storage.removeItem(REFRESH_TOKEN_KEY, true)
		dispatch({ type: LOGOUT })
		callback()
	}
}

export const fetchUser = (callback = () => {}) => {
	/* effectively checks if the token is valid */
	return async (dispatch, getState) => {
		const { fetchService } = getState()
		resp = await fetchService.fetch("/user/me", {
			method: "GET"
		})
		if (!("user" in resp.json) || resp.status != 200) {
			callback()
			return
		}
		dispatch(setUser(resp.json.user))
		callback(resp.json.user)
	}
}

export const exchangeToken = (token, callback) => {
	return async (dispatch, getState) => {
		const { fetchService } = getState()
		resp = await fetchService.fetch("/login/exchange_token", {
			method: "POST",
			body: JSON.stringify({
				exchange_token: token
			})
		})
		if (resp.status != 200) {
			let msg = "Error occured."
			if (resp.json.hasOwnProperty("message")) msg = resp.json.message
			callback(msg)
			return
		}
		setTokens(resp.json.auth_token, resp.json.refresh_token)
		dispatch(fetchUser(callback))
	}
}

export const openFacebook = (token = "") => {
	let url = ROOT_URL + "/login/facebook"
	if (token) {
		url += "?token=" + token
	}
	Linking.openURL(url)
}

/*export const registerDeviceToken = () => {
	return async (dispatch, getState) => {
		fcmToken = await firebase.messaging().getToken()
		if (fcmToken) {
			const { user, fetchService } = getState()
			resp = await fetchService.fetch("/login/register_firebase_token", {
				method: "POST",
				body: JSON.stringify({
					firebase_token: fcmToken
				})
			})
			if (!("user_id" in resp.json)) return
			if (resp.json.user_id == user.id && resp.status == 201) {
				dispatch({ type: "DEVICE_TOKEN_ADDED" })
			}
		}
	}
} */
