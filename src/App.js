import React, { Component } from "react"
import { Provider } from "react-redux"
import {
	createSwitchNavigator,
	createStackNavigator,
	createAppContainer
} from "react-navigation"
import { SafeAreaView, Platform } from "react-native"
import NormalUser from "./screens/normal_user"
import Teacher from "./screens/teacher"
import Student from "./screens/student"
import UserLoading from "./screens/UserLoading"
import SignIn from "./screens/auth/SignIn"
import SignUpNav from "./screens/auth/SignUpNav"
import AuthLoading from "./screens/auth/AuthLoading"
import configureStore from "./Store"
import { setCustomText } from "react-native-global-props"
import codePush from "react-native-code-push"
import firebase from "react-native-firebase"
import { NavigationActions } from "react-navigation"

const store = configureStore()

const AppNav = createSwitchNavigator(
	{
		Teacher: Teacher,
		Student: Student,
		NormalUser: NormalUser,
		First: UserLoading
	},
	{
		initialRouteName: "First"
	}
)
const AuthStack = createStackNavigator(
	{ First: SignIn, SignUp: SignUpNav },
	{
		mode: "modal",
		initialRouteName: "First",
		headerMode: "none",
		navigationOptions: {
			headerVisible: false
		}
	}
)

const navigationPersistenceKey = __DEV__ ? "NavigationStateDEV7" : null
const Page = createAppContainer(
	createSwitchNavigator(
		{
			AuthLoading: AuthLoading,
			App: AppNav,
			Auth: AuthStack
		},
		{
			initialRouteName: "AuthLoading"
		}
	)
)

const customTextProps = {
	style: {
		fontFamily: "Assistant-Regular",
		fontSize: 16,
		color: "black"
	}
}
setCustomText(customTextProps)

class App extends Component {
	codePushDownloadDidProgress(progress) {
		console.log(
			progress.receivedBytes + " of " + progress.totalBytes + " received."
		)
	}

	async componentDidMount() {
		this.createNotificationListeners()
	}

	componentWillUnmount() {
		this.notificationListener()
		this.notificationOpenedListener()
	}

	_displayNotification = notification => {
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
				.setChannelId("dryvo-channel") // e.g. the id you chose above
				.android.setPriority(
					firebase.notifications.Android.Priority.High
				)
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

	_handleNotification = (notification, fromClosed = false) => {
		const state = store.getState()
		firebase
			.notifications()
			.removeDeliveredNotification(
				notification.notification._notificationId
			)
		if (!this.navigator) return
		let filter = "lessons/"
		const title = notification.notification._title.toLowerCase()
		if (title.includes("payment")) {
			filter += "payments"
		} else if (title.includes("request")) {
			filter = "teacher/students"
		}

		if (fromClosed) {
			// app was closed, we need to init AuthLoading and UserLoading
			this.navigator.dispatch(
				NavigationActions.navigate({
					routeName: "AuthLoading",
					params: { filter }
				})
			)
			return
		}
		if (state.user && state.user.is_approved) {
			// application was opened in foreground or background
			this.navigator.dispatch(
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

	async createNotificationListeners() {
		// Build a channel
		const channel = new firebase.notifications.Android.Channel(
			"dryvo-channel",
			"Dryvo Channel",
			firebase.notifications.Android.Importance.Max
		).setDescription("Dryvo channel")

		// Create the channel
		firebase.notifications().android.createChannel(channel)

		/*
		 * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
		 * */
		this.notificationListener = firebase
			.notifications()
			.onNotification(notification => {
				console.log("notification", notification)
				this._displayNotification(notification)
			})

		this.notificationOpenedListener = firebase
			.notifications()
			.onNotificationOpened(notification => {
				console.log("background notification")
				this._handleNotification(notification)
			})

		/*
		 * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
		 * */
		const notification = await firebase
			.notifications()
			.getInitialNotification()
		if (notification) {
			console.log("background2 notification")
			this._handleNotification(notification, true)
		}
	}

	render() {
		return (
			<Provider store={store}>
				<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
					<Page
						ref={nav => {
							this.navigator = nav
						}}
					/>
				</SafeAreaView>
			</Provider>
		)
	}
}

const app = codePush(App)

export default app
