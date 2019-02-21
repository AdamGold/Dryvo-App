import "react-native"
import React from "react"

import renderer from "react-test-renderer"

import { SignIn } from "../../src/screens/auth/SignIn"

describe("SignIn", () => {
	test("view renders correctly", () => {
		const tree = renderer.create(<SignIn />).toJSON()
		expect(tree).toMatchSnapshot()
	})
})
