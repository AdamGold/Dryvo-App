import "react-native"
import React from "react"

import renderer from "react-test-renderer"

import { AuthLoading } from "../../src/screens/auth/AuthLoading"

describe("AuthLoading", () => {
	test("view renders correctly", done => {
		fetch.mockResponseSuccess(
			JSON.stringify({
				user: { name: "test" }
			})
		)
		const wrapper = shallow(<AuthLoading dispatch={dispatch} />)
		testAsyncComponent(wrapper, done)
	})
})
