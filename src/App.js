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
import firebase from "react-native-firebase"

const store = configureStore()

const AppNav = createSwitchNavigator(
	{
		Teacher: Teacher,
		Student: Student,
		NormalUser: NormalUser,
		UserLoading: UserLoading
	},
	{
		initialRouteName: "UserLoading"
	}
)
const AuthStack = createStackNavigator(
	{ SignIn: SignIn, SignUp: SignUpNav },
	{
		mode: "modal",
		initialRouteName: "SignIn",
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

export default class App extends Component {
	async componentDidMount() {
		this.createNotificationListeners()
	}
	async createNotificationListeners() {
		/*
		 * Triggered when a particular notification has been received in foreground
		 * */
		this.notificationListener = firebase
			.notifications()
			.onNotification(notification => {
				const { title, body } = notification
				console.log("foreground notification")
				console.log(notification)
			})

		/*
		 * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
		 * */
		this.notificationOpenedListener = firebase
			.notifications()
			.onNotificationOpened(notificationOpen => {
				const { title, body } = notificationOpen.notification
				console.log("background notification")
				console.log(notificationOpen)
			})

		/*
		 * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
		 * */
		const notificationOpen = await firebase
			.notifications()
			.getInitialNotification()
		if (notificationOpen) {
			const { title, body } = notificationOpen.notification
			console.log("background2 notification")
			console.log(notificationOpen)
		}
	}
	render() {
		return (
			<Provider store={store}>
				<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
					<Page />
				</SafeAreaView>
			</Provider>
		)
	}
}
