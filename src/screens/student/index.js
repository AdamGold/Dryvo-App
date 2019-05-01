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
import StudentProfile from "../student/Profile"

export default createBottomTabNavigator(
	{
		Home: createStackNavigator(
			{
				Main: createStackNavigator(
					{ Home, Lesson },
					{
						initialRouteKey: "Home",
						headerMode: "none"
					}
				),
				Settings
			},
			{
				initialRouteName: "Main",
				mode: "modal",
				headerMode: "none",
				navigationOptions: {
					headerVisible: false
				}
			}
		),
		Notifications: createStackNavigator(
			{ Main: Notifications, Lesson },
			{
				initialRouteKey: "Main",
				headerMode: "none"
			}
		),
		AddLesson: Lesson,
		Schedule: createStackNavigator(
			{ Main: Schedule, Lesson },
			{
				initialRouteKey: "Main",
				headerMode: "none"
			}
		),
		StudentProfile: Profile
	},
	tabBarOptions
)
