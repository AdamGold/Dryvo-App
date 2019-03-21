import React from "react"

import renderer from "react-test-renderer"

import { SignUpAs } from "../../src/screens/auth/SignUpAs"

const navigation = { navigate: jest.fn(), getParam: param => "student" }
describe("SignUpAs", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(<SignUpAs navigation={navigation} />)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
