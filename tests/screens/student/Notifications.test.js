import "react-native"
import React from "react"

import renderer from "react-test-renderer"

import { Notifications } from "../../../src/screens/student/Notifications"

describe("Notifications", () => {
	test("view renders correctly", done => {
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
					}
				}}
				dispatch={dispatch}
				fetchService={fetchService}
				user={{
					my_teacher: { user: { id: 2 }, name: "teacher" },
					name: "student"
				}}
			/>
		)
		testAsyncComponent(wrapper, done)
	})
})
