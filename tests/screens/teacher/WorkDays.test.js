import "react-native"
import React from "react"

import FetchService from "../../../src/services/Fetch"
import { WorkDays } from "../../../src/screens/teacher/WorkDays"

describe("WorkDays", () => {
	test.skip("view renders correctly", done => {
		fetch.mockResponseSuccess(
			JSON.stringify({
				data: [
					{
						day: 0,
						from_hour: 13,
						from_minutes: 0,
						id: 76,
						on_date: null,
						to_hour: 17,
						to_minutes: 0
					},
					{
						day: 0,
						from_hour: 5,
						from_minutes: 0,
						id: 75,
						on_date: null,
						to_hour: 11,
						to_minutes: 0
					},
					{
						day: 1,
						from_hour: 5,
						from_minutes: 0,
						id: 85,
						on_date: null,
						to_hour: 11,
						to_minutes: 0
					}
				]
			})
		)
		const wrapper = shallow(
			<WorkDays
				navigation={{ ...navigation, getParam: jest.fn() }}
				dispatch={dispatch}
				fetchService={fetchService}
			/>
		)
		testAsyncComponent(wrapper, done)
	})
})
