import React, { Component } from "react"
import { Provider } from "react-redux"
import {
	createSwitchNavigator,
	createBottomTabNavigator,
	createStackNavigator,
	createAppContainer
} from "react-navigation"
import Home from "./screens/Home"
import SignIn from "./screens/auth/SignIn"
import SignUp from "./screens/auth/SignUp"
import AuthLoading from "./screens/auth/AuthLoading"
import configureStore from "./Store"

const store = configureStore()

const AppStack = createBottomTabNavigator({ Home: Home })
const AuthStack = createStackNavigator(
	{ SignIn: SignIn, SignUp: SignUp },
	{ initialRouteName: "SignIn" }
)
const Page = createAppContainer(
	createSwitchNavigator(
		{
			AuthLoading: AuthLoading,
			App: AppStack,
			Auth: AuthStack
		},
		{
			initialRouteName: "AuthLoading"
		}
	)
)

export default class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<Page />
			</Provider>
		)
	}
}
