import React from "react"
import {
	createBottomTabNavigator,
	createStackNavigator
} from "react-navigation"
import { tabBarOptions } from "../consts"
import Home from "./Home"
import Notifications from "./Notifications"
import ChooseDate from "./ChooseDate"
import NewLesson from "./NewLesson"
import Students from "./Students"
import NewStudent from "./NewStudent"
import Schedule from "./Schedule"
import { strings } from "../../i18n"
import AddPayment from "./AddPayment"

export default createBottomTabNavigator(
	{
		Home: createStackNavigator(
			{ Home, AddPayment },
			{
				initialRouteName: "Home",
				mode: "modal",
				headerMode: "none",
				navigationOptions: {
					headerVisible: false
				}
			}
		),
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
	tabBarOptions
)
