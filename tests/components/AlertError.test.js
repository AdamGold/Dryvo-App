import React from "react"
import { Alert } from "react-native"

jest.mock("Alert", () => {
	return {
		alert: jest.fn()
	}
})

import AlertError from "../../src/components/AlertError"
import Fetch from "../../src/services/Fetch"

describe("AlertError", () => {
	test("catches error correctly", done => {
		const wrapper = shallow(<AlertError dispatch={dispatch} />)
		const newDispatch = jest.fn(func => {
			if (typeof func == "function") {
				return func(dispatch, () => {
					return { fetchService: new Fetch(), error: "test" }
				})
			}
		})
		wrapper.setProps({ dispatch: newDispatch })
		wrapper.update()
		expect(newDispatch).toHaveBeenCalled()
		expect(Alert.alert).toHaveBeenCalled()
		done()
	})
})
