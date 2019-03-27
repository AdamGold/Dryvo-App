import React from "react"
import { Icon } from "react-native-elements"
const options = {
	activeTintColor: "rgb(12,116,244)",
	inactiveTintColor: "black",
	showLabel: false
}

export const tabBarOptions = {
	defaultNavigationOptions: ({ navigation }) => ({
		tabBarIcon: ({ focused, horizontal, tintColor }) => {
			const { routeName } = navigation.state
			let iconName
			let iconType = "material"
			if (routeName === "Home") {
				iconName = "home"
			} else if (routeName === "Notifications") {
				iconName = "notifications"
			} else if (routeName === "Lesson") {
				iconName = "add-circle"
			} else if (routeName === "Students") {
				iconName = "people"
			} else if (routeName == "Schedule") {
				iconName = "date-range"
			} else if (routeName == "Profile") {
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
