import { ROOT_URL, TOKEN_KEY } from "../consts"
import { Linking } from "react-native"
import { setFetchService } from "./utils"
import Storage from "../services/Storage"

export const exchangeToken = (token, callback) => {
	return async (dispatch, getState) => {
		const { fetchService } = getState()
		resp = await fetchService.fetch("/api/exchange_token", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				token
			})
		})
		dispatch(
			login(resp.json["auth_token"], resp.json["refresh_token"], callback)
		)
	}
}

export const registerDeviceToken = () => {
	return async (dispatch, getState) => {
		fcmToken = await firebase.messaging().getToken()
		if (fcmToken) {
			const { user, fetchService } = getState()
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
				dispatch({ type: "DEVICE_TOKEN_ADDED" })
			}
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
