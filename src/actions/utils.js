import { Platform, Linking } from "react-native"
import FetchService from "../services/Fetch"
import { LOAD_FETCH_SERVICE } from "../reducers/consts"

export const loadFetchService = () => {
	return {
		type: LOAD_FETCH_SERVICE
	}
}

export const deepLinkingListener = async func => {
	let url = await Linking.getInitialURL()
	func({ url: url })
}
