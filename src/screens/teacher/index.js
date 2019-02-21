import React from "react"
import {
	createBottomTabNavigator,
	createStackNavigator
} from "react-navigation"
import Home from "./Home"
import Notifications from "./Notifications"
import ChooseDate from "./ChooseDate"
import NewLesson from "./NewLesson"
import Students from "./Students"
import NewStudent from "./NewStudent"
import Schedule from "./Schedule"
import { strings } from "../../i18n"
import { Icon } from "react-native-elements"

export default createBottomTabNavigator(
	{
		Home: Home,
		Notifications: Notifications,
		Add: {
			screen: createStackNavigator(
				{ ChooseDate: ChooseDate, NewLesson: NewLesson },
				{
					initialRouteName: "ChooseDate",
					headerMode: "none",
					navigationOptions: {
						headerVisible: false
					}
				}
			),
			navigationOptions: {
				title: "add",
				tabBarLabel: strings("tabs.add"),
				tabBarAccessibilityLabel: strings("tabs.add"),
				tabBarTestID: "NewLessonTab"
			}
		},
		Schedule: Schedule,
		Students: {
			screen: createStackNavigator(
				{ Students: Students, NewStudent: NewStudent },
				{
					mode: "modal",
					initialRouteName: "Students",
					headerMode: "none",
					navigationOptions: {
						headerVisible: false
					}
				}
			),
			navigationOptions: {
				title: "students",
				tabBarLabel: strings("tabs.students"),
				tabBarAccessibilityLabel: strings("tabs.students"),
				tabBarTestID: "StudentsTab"
			}
		}
	},
	{
		defaultNavigationOptions: ({ navigation }) => ({
			tabBarIcon: ({ focused, horizontal, tintColor }) => {
				const { routeName } = navigation.state
				let iconName
				let iconType = "material"
				if (routeName === "Home") {
					iconName = "home"
				} else if (routeName === "Notifications") {
					iconName = "notifications"
				} else if (routeName === "Add") {
					iconName = "add-circle"
				} else if (routeName === "Students") {
					iconName = "people"
				} else if (routeName == "Schedule") {
					iconName = "date-range"
				}

				// You can return any component that you like here!
				return (
					<Icon
						name={iconName}
						size={25}
						color={tintColor}
						type={iconType}
					/>
				)
			}
		}),
		tabBarOptions: {
			activeTintColor: "rgb(12,116,244)",
			inactiveTintColor: "black",
			showLabel: false
		}
	}
)
