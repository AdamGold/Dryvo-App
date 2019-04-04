import React, { Component } from "react"
import { createBottomTabNavigator } from "react-navigation"
import Home from "./Home"
import { tabBarOptions } from "../consts"

export default createBottomTabNavigator(
	{
		Home: Home
	},
	tabBarOptions
)
