import {
	createBottomTabNavigator,
	createStackNavigator
} from "react-navigation"
import { tabBarOptions } from "../consts"
import Home from "./Home"
import Notifications from "./Notifications"
import Lesson from "./Lesson"
import Schedule from "./Schedule"
import Profile from "./Profile"
import Settings from "../Settings"

export default createBottomTabNavigator(
	{
		Home: createStackNavigator(
			{
				Home,
				Settings
			},
			{
				initialRouteName: "Home",
				mode: "modal",
				headerMode: "none",
				navigationOptions: {
					headerVisible: false
				}
			}
		),
		Notifications,
		Lesson,
		Schedule,
		Profile
	},
	tabBarOptions
)
