import React from "react"

import renderer from "react-test-renderer"

import Logo from "../../src/components/Logo"

jest.useFakeTimers()
describe("Logo", () => {
	test("view renders correctly", () => {
		const tree = renderer.create(<Logo size="large" />).toJSON()
		expect(tree).toMatchSnapshot()
	})
})
