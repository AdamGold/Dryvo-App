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
import { strings } from "../../i18n"

export default createBottomTabNavigator({
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
			tabBarTestID: "StudentsTabs"
		}
	}
})
