import "react-native"
import React from "react"

import renderer from "react-test-renderer"

import { Reports } from "../../../src/screens/teacher/Reports"

describe("Reports", () => {
	test.skip("view renders correctly", () => {
		const tree = renderer.create(<Reports />).toJSON()
		expect(tree).toMatchSnapshot()
	})
})
