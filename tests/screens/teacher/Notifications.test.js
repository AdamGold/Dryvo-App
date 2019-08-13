import "react-native"
import React from "react"

import { Notifications } from "../../../src/screens/teacher/Notifications"

describe("Notifications", () => {
	test.skip("view renders correctly", done => {
		const student = { name: "test", student_id: 1 }
		fetch.mockResponseSuccess(
			JSON.stringify({
				data: [
					{
						duration: 40,
						student
					},
					{
						duration: 100,
						student
					}
				]
			})
		)
		const wrapper = shallow(
			<Notifications
				navigation={{
					...navigation,
					getParam: param => {
						return null
					},
					state: { params: { filter: "lessons" } }
				}}
				dispatch={dispatch}
				fetchService={fetchService}
			/>
		)
		testAsyncComponent(wrapper, done)
	})
})
