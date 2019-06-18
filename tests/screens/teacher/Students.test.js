import "react-native"
import React from "react"

import FetchService from "../../../src/services/Fetch"
import { Students } from "../../../src/screens/teacher/Students"

const fetchService = new FetchService()
jest.useFakeTimers()
describe("Students", () => {
	test("view renders correctly", done => {
		fetch.mockResponseSuccess(
			JSON.stringify({
				data: [
					{ student_id: 1, name: "test1" },
					{ student_id: 2, name: "test2" }
				],
				next_url: ""
			})
		)
		const wrapper = shallow(
			<Students
				navigation={navigation}
				dispatch={dispatch}
				fetchService={fetchService}
			/>
		)
		testAsyncComponent(wrapper, done)
	})
})
