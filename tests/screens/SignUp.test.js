import { Button } from "react-native"
import React from "react"

import renderer from "react-test-renderer"

import { SignUp } from "../../src/screens/auth/SignUp"

describe("SignUp", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(
				<SignUp
					navigation={{ ...navigation, getParam: param => "student" }}
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
