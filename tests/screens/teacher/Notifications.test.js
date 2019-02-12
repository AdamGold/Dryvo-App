import "react-native"
import React from "react"

import renderer from "react-test-renderer"

import { Notifications } from "../../../src/screens/teacher/Notifications"

describe("Notifications", () => {
	test("view renders correctly", () => {
		const tree = renderer.create(<Notifications />).toJSON()
		expect(tree).toMatchSnapshot()
	})
})
