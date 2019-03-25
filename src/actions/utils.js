import { Platform, Linking } from "react-native"
import { LOAD_FETCH_SERVICE, API_ERROR } from "../reducers/consts"
import moment from "moment"

export const fetch = (endpoint, params, dispatchError = true) => {
	return async (dispatch, getState) => {
		const { fetchService } = getState()
		try {
			const resp = await fetchService.fetch(endpoint, params)
			return resp
		} catch (error) {
			if (dispatchError) {
				if (error && error.hasOwnProperty("message"))
					msg = error.message
				dispatch({ type: API_ERROR, error })
			}
			return null
		}
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
	const start = moment.utc(date).format("HH:mm")
	const end = moment
		.utc(date)
		.add(duration, "minutes")
		.format("HH:mm")

	return { start, end }
}
