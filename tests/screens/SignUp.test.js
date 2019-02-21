import { Button } from "react-native"
import React from "react"

import renderer from "react-test-renderer"

import { SignUp } from "../../src/screens/auth/SignUp"

let render
describe("SignUp", () => {
	beforeAll(() => {
		render = renderer.create(<SignUp />)
	})
	test("view renders correctly", () => {
		const tree = render.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
