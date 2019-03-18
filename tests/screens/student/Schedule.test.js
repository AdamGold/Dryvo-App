import "react-native"
import React from "react"

import renderer from "react-test-renderer"

import { Schedule } from "../../../src/screens/student/Schedule"

describe("Schedule", () => {
	test.skip("view renders correctly", () => {
		const tree = renderer.create(<Schedule />).toJSON()
		expect(tree).toMatchSnapshot()
	})
})
