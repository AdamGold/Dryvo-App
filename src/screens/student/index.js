import React, { Component } from "react"
import { createBottomTabNavigator } from "react-navigation"
import { tabBarOptions } from "../consts"
import Home from "./Home"
import Notifications from "./Notifications"
import NewLesson from "./NewLesson"
import Schedule from "./Schedule"
import Profile from "./Profile"

export default createBottomTabNavigator(
	{
		Home,
		Notifications,
		Add: NewLesson,
		Schedule,
		Profile
	},
	tabBarOptions
)
