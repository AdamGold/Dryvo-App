import "react-native"
import React from "react"

import renderer from "react-test-renderer"

import { Kilometers } from "../../../src/screens/teacher/Kilometers"

describe("Kilometers", () => {
	test.skip("view renders correctly", () => {
		const tree = renderer.create(<Kilometers />).toJSON()
		expect(tree).toMatchSnapshot()
	})
})
