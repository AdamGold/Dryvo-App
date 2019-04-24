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

class App extends Component {
	codePushDownloadDidProgress(progress) {
		console.log(
			progress.receivedBytes + " of " + progress.totalBytes + " received."
		)
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

const app = codePush(App)

export default app
