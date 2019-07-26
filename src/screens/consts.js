import React from "react"
import { Platform } from "react-native"
import TabBar from "../components/TabBar"
import { Icon } from "react-native-elements"
import { strings } from "../i18n"
const options = {
	activeTintColor: "rgb(12,116,244)",
	inactiveTintColor: "black",
	showLabel: false
}

// https://github.com/react-navigation/react-navigation-tabs/issues/16#issuecomment-402557546
let androidKeyboardFix = {}
if (Platform.OS == "android") {
	androidKeyboardFix = {
		tabBarComponent: props => <TabBar {...props} />,
		tabBarPosition: "bottom"
	}
}
export const tabBarOptions = {
	...androidKeyboardFix,
	defaultNavigationOptions: ({ navigation }) => ({
		tabBarIcon: ({ focused, horizontal, tintColor }) => {
			const { routeName } = navigation.state
			let iconName
			let iconType = "material"
			if (routeName === "Home") {
				iconName = "home"
			} else if (routeName === "Notifications") {
				iconName = "notifications"
			} else if (routeName === "AddLesson" || routeName == "Lesson") {
				iconName = "add-circle"
			} else if (routeName === "Students") {
				iconName = "people"
			} else if (routeName == "Schedule") {
				iconName = "date-range"
			} else if (routeName == "StudentProfile") {
				iconName = "person"
			}

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
	tabBarOptions: options
}

export const durationMulOptions = [
	{ value: 1, label: strings("normal_lesson") },
	{ value: 1.5, label: strings("lesson_and_a_half") },
	{ value: 2, label: strings("double_lesson") },
	{ value: 3, label: strings("triple_lesson") }
]
