import React, { Component } from "react"
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
import Topics from "../Topics"

export default createBottomTabNavigator(
	{
		Home,
		Notifications,
		Add: Lesson,
		Schedule,
		Profile
	},
	tabBarOptions
)
