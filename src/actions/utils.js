import { Platform, Linking } from "react-native"
import {
	LOAD_FETCH_SERVICE,
	API_ERROR,
	APP_ERROR,
	POP_ERROR,
	CHANGE_USER_IMAGE
} from "../reducers/consts"
import { DEFAULT_IMAGE, DEFAULT_IMAGE_MAX_SIZE, DEFAULT_ERROR } from "../consts"
import { getLatestError } from "../error_handling"
import { strings } from "../i18n"
import moment from "moment"
import Storage from "../services/Storage"
import ImagePicker from "react-native-image-picker"
import ImageResizer from "react-native-image-resizer"
import firebase from "react-native-firebase"

export const fetchOrError = (endpoint, params, dispatchError = true) => {
	return async (dispatch, getState) => {
		const { fetchService } = getState()
		try {
			const resp = await fetchService.fetch(endpoint, params)
			return resp
		} catch (error) {
			if (dispatchError) {
				let msg = error || ""
				if (error && error.hasOwnProperty("message"))
					msg = error.message
				dispatch({ type: API_ERROR, error: msg })
			}
			return null
		}
	}
}

export const popLatestError = type => {
	return (dispatch, getState) => {
		const { errors } = getState()
		const error = getLatestError(errors[type])
		if (error) {
			dispatch({ type: POP_ERROR, errorType: type })
			return error
		}
		return null
	}
}

export const loadFetchService = () => {
	return {
		type: LOAD_FETCH_SERVICE
	}
}

export const deepLinkingListener = async func => {
	if (Platform.OS === "android") {
		/// This is called on startup
		let url = await Linking.getInitialURL()
		func({ url: url })
	} else {
		Linking.addEventListener("url", func)
	}
}

export const deepLinkingRemoveListener = async func => {
	Linking.removeEventListener("url", func)
}

export const getHoursDiff = (date, duration) => {
	const start = moment
		.utc(date)
		.local()
		.format("HH:mm")
	const end = moment
		.utc(date)
		.add(duration, "minutes")
		.local()
		.format("HH:mm")

	return { start, end }
}

export const registerDeviceToken = (token, force) => {
	return async (dispatch, getState) => {
		const { user } = getState()
		if (!user) return
		const existing_token = await Storage.getItem(
			"firebase_token_user_" + user.id,
			true
		)
		// we already registered the firebase token.
		// let's check it's expiry and only if it's expired,
		// register again
		if (
			existing_token &&
			JSON.parse(existing_token).expiry >= new Date() &&
			!force
		) {
			console.log("found existing token, not registering")
			return
		}
		return await dispatch(_registerDeviceToken(token))
	}
}

export const deleteDeviceToken = () => {
	return async (dispatch, getState) => {
		const { user, fetchService } = getState()
		if (!user) return
		const existing_token = await Storage.getItem(
			"firebase_token_user_" + user.id,
			true
		)
		if (existing_token) {
			try {
				await Storage.removeItem("firebase_token_user_" + user.id, true)
				await fetchService.fetch("/user/delete_firebase_token", {
					method: "GET"
				})
			} catch (error) {
				dispatch({ type: API_ERROR, error: DEFAULT_ERROR })
			}
		}
	}
}

const _registerDeviceToken = fcmToken => {
	return async (dispatch, getState) => {
		if (fcmToken) {
			const { fetchService, user } = getState()
			try {
				const resp = await fetchService.fetch(
					"/user/register_firebase_token",
					{
						method: "POST",
						body: JSON.stringify({
							token: fcmToken
						})
					}
				)
				if (resp.status == 200) {
					console.log("registered token")
					let date = new Date()
					const expiry = date.setDate(date.getDate() + 7) // 7 days from now
					await Storage.setItem(
						"firebase_token_user_" + user.id,
						JSON.stringify({ token: fcmToken, expiry }),
						true
					)
				}
			} catch (err) {
				dispatch({ type: API_ERROR, error: DEFAULT_ERROR })
			}
		}
	}
}

export const getUserImage = user => {
	if (user && user.hasOwnProperty("image") && user["image"] != "") {
		return user["image"]
	} else {
		return DEFAULT_IMAGE
	}
}

export const showImagePicker = (callback, sizes = {}) => {
	const options = {
		title: strings("select_image"),
		storageOptions: {
			skipBackup: true
		}
	}
	ImagePicker.showImagePicker(options, response => {
		//const source = "data:image/jpeg;base64," + response.data
		sizes = {
			width: sizes.width || DEFAULT_IMAGE_MAX_SIZE,
			height: sizes.height || DEFAULT_IMAGE_MAX_SIZE
		}
		if (!response.didCancel && !response.error) {
			ImageResizer.createResizedImage(
				response.uri,
				sizes.width,
				sizes.height,
				"JPEG",
				100
			)
				.then(resizeResponse => {
					const source = {
						uri: resizeResponse.uri,
						name: resizeResponse.name,
						type: response.type
					}

					callback(source)
				})
				.catch(err => {
					dispatch({ type: APP_ERROR, error: DEFAULT_ERROR })
				})
		}
	})
}

export const uploadUserImage = source => {
	return async (dispatch, getState) => {
		const { fetchService } = getState()
		var data = new FormData()
		data.append("image", source)
		try {
			const resp = await fetchService.fetch("/user/image", {
				method: "POST",
				headers: {
					"Content-Type": "multipart/form-data"
				},
				body: data
			})
			await dispatch({
				type: CHANGE_USER_IMAGE,
				image: resp.json["image"]
			})
		} catch (error) {
			dispatch({ type: API_ERROR, error: DEFAULT_ERROR })
		}
	}
}

export function checkFirebasePermission(
	requestPermission = false,
	force = false
) {
	return async dispatch => {
		const enabled = await firebase.messaging().hasPermission()
		if (enabled) {
			await dispatch(getFirebaseToken(force))
		} else {
			if (requestPermission)
				await dispatch(requestFirebasePermission(force))
		}
	}
}

export function getFirebaseToken(force) {
	return async dispatch => {
		const fcmToken = await firebase.messaging().getToken()
		if (fcmToken) {
			// user has a device token
			await dispatch(registerDeviceToken(fcmToken, force))
		}
	}
}

export function requestFirebasePermission() {
	return async dispatch => {
		try {
			await firebase.messaging().requestPermission()
			// User has authorised
			await dispatch(getFirebaseToken())
		} catch (error) {
			// User has rejected permissions
			console.log("permission rejected")
		}
	}
}

export function getGreetingTime(m, afternoon = 12, evening = 17) {
	var g = null

	if (!m || !m.isValid()) {
		return
	} //if we can't find a valid or filled moment, we return.

	var currentHour = parseFloat(m.format("HH"))
	if (currentHour >= afternoon && currentHour < evening) {
		g = "afternoon"
	} else if (currentHour >= evening) {
		g = "evening"
	} else {
		g = "morning"
	}

	return g
}

export function navigateToEZCount(endpoint) {
	return async dispatch => {
		const resp = await dispatch(
			fetchOrError("/teacher/ezcount?redirect=" + endpoint, {
				method: "GET"
			})
		)
		if (resp) {
			Linking.openURL(resp.json["url"])
		}
	}
}
