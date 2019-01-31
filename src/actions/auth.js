import { ROOT_URL, TOKEN_KEY, REFRESH_TOKEN_KEY } from "../consts"
import { Linking } from "react-native"
import Storage from "../services/Storage"
import {
	LOGIN,
	LOGOUT,
	API_ERROR,
	API_BACKGROUND_ERROR
} from "../reducers/consts"

export const directLogin = (email, password, callback) => {
	return async (dispatch, getState) => {
		const { fetchService } = getState()
		try {
			resp = await fetchService.fetch("/login/direct", {
				method: "POST",
				body: JSON.stringify({
					email,
					password
				})
			})
			setTokens(resp.json.auth_token, resp.json.refresh_token)
			dispatch(setUser(resp.json.user))
			callback()
		} catch (error) {
			dispatch({ type: API_ERROR, error: error.message })
		}
	}
}

export const register = (params, callback) => {
	return async (dispatch, getState) => {
		const { fetchService } = getState()
		try {
			resp = await fetchService.fetch("/login/register", {
				method: "POST",
				body: JSON.stringify(params)
			})
			setTokens(resp.json.auth_token, resp.json.refresh_token)
			dispatch(setUser(resp.json.user))
			callback()
		} catch (error) {
			dispatch({ type: API_ERROR, error: error.message })
		}
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
		try {
			resp = await fetchService.fetch("/user/me", {
				method: "GET"
			})
			dispatch(setUser(resp.json.user))
			callback(resp.json.user)
		} catch (error) {
			callback(null)
		}
	}
}

export const exchangeToken = (token, callback) => {
	return async (dispatch, getState) => {
		const { fetchService } = getState()
		try {
			resp = await fetchService.fetch("/login/exchange_token", {
				method: "POST",
				body: JSON.stringify({
					exchange_token: token
				})
			})
			setTokens(resp.json.auth_token, resp.json.refresh_token)
			dispatch(fetchUser(callback))
		} catch (error) {
			dispatch({ type: API_ERROR, error: error.message })
		}
	}
}

export const openFacebook = (token = "") => {
	let url = ROOT_URL + "/login/facebook"
	if (token) {
		url += "?token=" + token
	}
	Linking.openURL(url)
}

/*
export const registerDeviceToken = async state => {
	let existing_token = await Storage.getItem("firebase_token", true)
	if (existing_token) {
		// we already registered the firebase token.
		// let's check it's expiry and if it's expired,
		// register again
		existing_token = JSON.parse(existing_token)
		if (new Date() >= existing_token.expiry) {
			// expired
			_registerDeviceToken(state)
		}
		return
	}
	_registerDeviceToken(state)
}

const _registerDeviceToken = async state => {
	fcmToken = await firebase.messaging().getToken()
	if (fcmToken) {
		const { user, fetchService } = state
		resp = await fetchService.fetch("/api/register_token", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				firebase_token: fcmToken
			})
		})
		if (!("user_id" in resp.json)) return
		if (resp.json.user_id == user.id && resp.status == 201) {
			date = new Date()
			expiry = date.setDate(date.getDate() + 7) // 7 days from now
			Storage.setItem(
				"firebase_token",
				JSON.stringify({ token: fcmToken, expiry }),
				true
			)
		}
	}
}
*/
