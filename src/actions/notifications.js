import { NavigationActions } from "react-navigation"
import firebase from "react-native-firebase"
import { Platform } from "react-native"
import { FCM_CHANNEL } from "../consts"

export function createFirebaseChannel() {
	// Build a channel
	const channel = new firebase.notifications.Android.Channel(
		FCM_CHANNEL,
		"Dryvo Channel",
		firebase.notifications.Android.Importance.Max
	).setDescription("Dryvo channel")

	// Create the channel
	firebase.notifications().android.createChannel(channel)
}

export function handleNotification(
	store,
	navigator,
	notification,
	fromClosed = false
) {
	const state = store.getState()
	firebase
		.notifications()
		.removeDeliveredNotification(notification.notification._notificationId)
	let filter = "lessons/"
	const title = notification.notification._title.toLowerCase()
	if (title.includes("payment")) {
		filter += "payments"
	} else if (title.includes("request")) {
		filter = "teacher/students"
	}

	if (fromClosed) {
		// app was closed, we need to init AuthLoading and UserLoading
		navigator.dispatch(
			NavigationActions.navigate({
				routeName: "AuthLoading",
				params: { filter }
			})
		)
		return
	}
	if (state.user && state.user.is_approved) {
		// application was opened in foreground or background
		navigator.dispatch(
			NavigationActions.navigate({
				routeName: "Notifications",
				params: {},
				action: NavigationActions.navigate({
					routeName: "Main",
					params: {
						filter
					}
				})
			})
		)
	}
}

export function displayNotification(notification) {
	let params = {}
	if (Platform.OS === "android") {
		params = {
			sound: "default",
			show_in_foreground: true
		}
	}
	let localNotification = new firebase.notifications.Notification(params)
		.setNotificationId(notification.notificationId)
		.setTitle(notification.title)
		.setSubtitle(notification.subtitle)
		.setBody(notification.body)
		.setData(notification.data)

	if (Platform.OS === "android") {
		localNotification = localNotification.android
			.setChannelId(FCM_CHANNEL) // e.g. the id you chose above
			.android.setPriority(firebase.notifications.Android.Priority.High)
	} else if (Platform.OS === "ios") {
		localNotification = localNotification.ios.setBadge(
			notification.ios.badge
		)
	}

	firebase
		.notifications()
		.displayNotification(localNotification)
		.catch(err => console.log("notification error:", err))
}
