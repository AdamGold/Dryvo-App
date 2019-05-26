import React from "react"
import {
	createBottomTabNavigator,
	createStackNavigator,
	createSwitchNavigator
} from "react-navigation"
import { tabBarOptions } from "../consts"
import Home from "./Home"
import Notifications from "./Notifications"
import ChooseDate from "./ChooseDate"
import Lesson from "./Lesson"
import Students from "./Students"
import NewStudent from "./NewStudent"
import Schedule from "./Schedule"
import { strings } from "../../i18n"
import AddPayment from "./AddPayment"
import StudentProfile from "../student/Profile"
import Settings from "../Settings"
import WorkDays from "./WorkDays"
import Reports from "./Reports"

export default createBottomTabNavigator(
	{
		Home: createStackNavigator(
			{
				Main: createStackNavigator(
					{ Home, StudentProfile, Lesson },
					{
						initialRouteKey: "Home",
						headerMode: "none"
					}
				),
				AddPayment,
				Settings,
				WorkDays,
				Reports
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
			{ Main: Notifications, StudentProfile, Lesson },
			{
				initialRouteKey: "Main",
				headerMode: "none"
			}
		),
		AddLesson: {
			screen: createStackNavigator(
				{ ChooseDate, Lesson },
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
		Schedule: createStackNavigator(
			{ Main: Schedule, StudentProfile, Lesson, WorkDays },
			{
				initialRouteKey: "Main",
				headerMode: "none"
			}
		),
		Students: {
			screen: createStackNavigator(
				{
					Students: createStackNavigator(
						{ Students, StudentProfile },
						{
							initialRouteKey: "Students",
							headerMode: "none"
						}
					),
					NewStudent: NewStudent
				},
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
