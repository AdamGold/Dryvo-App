import React, { Component } from "react"
import { createBottomTabNavigator } from "react-navigation"
import Home from "./Home"
import Notifications from "./Notifications"

export default createBottomTabNavigator({
	Home: Home,
	Notifications: Notifications
})
