import "react-native"
import React from "react"

import renderer from "react-test-renderer"

import { NewStudent } from "../../../src/screens/teacher/NewStudent"

describe("Students", () => {
	test("view renders correctly", () => {
		const tree = renderer.create(<NewStudent />).toJSON()
		expect(tree).toMatchSnapshot()
	})
})
