import "react-native"
import React from "react"
import FetchService from "../../../src/services/Fetch"
import renderer from "react-test-renderer"

import { Home } from "../../../src/screens/student/Home"

const fetchService = new FetchService()
const navigation = {
	addListener: jest.fn()
}
jest.useFakeTimers()
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
				user={{ name: "student" }}
				fetchService={fetchService}
				dispatch={dispatch}
			/>
		)
		wrapper.instance()._handleRequests()
		testAsyncComponent(wrapper, done)
	})
})
