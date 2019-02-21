import "react-native"
import React from "react"

import renderer from "react-test-renderer"

import { Home } from "../../../src/screens/teacher/Home"

describe("Home", () => {
	test("view renders correctly", () => {
		const tree = renderer.create(<Home />).toJSON()
		expect(tree).toMatchSnapshot()
	})
})
