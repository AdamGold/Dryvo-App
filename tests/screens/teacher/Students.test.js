import "react-native"
import React from "react"

import renderer from "react-test-renderer"

import { Students } from "../../../src/screens/teacher/Students"

describe("Students", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(<Students navigation={{ addListener: jest.fn() }} />)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
