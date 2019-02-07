import "react-native"
import React from "react"

import renderer from "react-test-renderer"

import { AuthLoading } from "../../src/screens/auth/AuthLoading"

describe("AuthLoading", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(<AuthLoading dispatch={jest.fn()} />)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
