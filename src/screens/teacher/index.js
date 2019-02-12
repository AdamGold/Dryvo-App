import { createBottomTabNavigator } from "react-navigation"
import Home from "./Home"
import Notifications from "./Notifications"
import Add from "./Add"

export default createBottomTabNavigator({
	Home: Home,
	Notifications: Notifications,
	Add: Add
})
