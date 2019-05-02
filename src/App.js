import React, { Component } from "react"
import { Provider } from "react-redux"
import {
	createSwitchNavigator,
	createStackNavigator,
	createAppContainer
} from "react-navigation"
import { SafeAreaView } from "react-native"
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
import {
	displayNotification,
	handleNotification,
	createFirebaseChannel
} from "./actions/notifications"
import Analytics from "appcenter-analytics"
import Config from "react-native-config"

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

	async createNotificationListeners() {
		createFirebaseChannel()
		/*
		 * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
		 * */
		this.notificationListener = firebase
			.notifications()
			.onNotification(notification => {
				console.log("notification", notification)
				displayNotification(notification)
			})

		this.notificationOpenedListener = firebase
			.notifications()
			.onNotificationOpened(notification => {
				console.log("background notification")
				handleNotification(store, this.navigator, notification)
			})

		/*
		 * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
		 * */
		const notification = await firebase
			.notifications()
			.getInitialNotification()
		if (notification) {
			console.log("background2 notification")
			handleNotification(store, this.navigator, notification, true)
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

const options = { deploymentKey: Config.CODEPUSH_SECRET } // overide default key
Analytics.trackEvent("codepush deploy", { key: Config.CODEPUSH_SECRET })
const app = codePush(options)(App)

export default app
