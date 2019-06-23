import "react-native"
import React from "react"

import { Home } from "../../../src/screens/teacher/Home"

describe("Home", () => {
	test("view renders correctly", done => {
		const utils = require("../../../src/actions/utils")
		utils.getGreetingTime = jest.fn(() => "afternoon")
		const student = { name: "test" }
		fetch.mockResponseSuccess(
			JSON.stringify({
				data: [
					{
						student,
						dropoff_place: "t",
						meetup_place: "a"
					}
				]
			})
		)
		fetch.mockResponseSuccess(
			JSON.stringify({ data: [{ amount: 100, student }] })
		)
		const wrapper = shallow(
			<Home
				navigation={navigation}
				user={{ name: "teacher" }}
				fetchService={fetchService}
				dispatch={dispatch}
			/>
		)
		testAsyncComponent(wrapper, done)
	})
})
