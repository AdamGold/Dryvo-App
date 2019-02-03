import React from "react"
import { AuthLoading } from "../src/screens/auth/AuthLoading"
import renderer from "react-test-renderer"

test("AuthLoading renders correctly", () => {
	const tree = renderer.create(<AuthLoading />).toJSON()
	expect(tree).toMatchSnapshot()
})
