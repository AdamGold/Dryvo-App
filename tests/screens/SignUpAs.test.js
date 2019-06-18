import React from "react"

import renderer from "react-test-renderer"

import { SignUpAs } from "../../src/screens/auth/SignUpAs"

describe("SignUpAs", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(
				<SignUpAs
					navigation={{ ...navigation, getParam: param => "student" }}
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
