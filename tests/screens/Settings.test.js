import React from "react"

import { Settings } from "../../src/screens/Settings"

const user = { name: "test", area: "test", phone: "05501111", price: 1000 }
const student = {
	...user,
	student_id: 1,
	balance: 900,
	my_teacher: { user: {} }
}
const teacher = {
	...user,
	is_approved: true,
	teacher_id: 5,
	lesson_duration: 40
}
describe("Settings", () => {
	test("view renders correctly for student", done => {
		const wrapper = shallow(
			<Settings
				user={student}
				navigation={{ ...navigation, getParam: _ => topics }}
				dispatch={dispatch}
			/>
		)
		testAsyncComponent(wrapper, done)
	})

	test("view renders correctly for teacher", done => {
		const wrapper = shallow(
			<Settings
				user={teacher}
				navigation={{ ...navigation, getParam: _ => topics }}
				dispatch={dispatch}
			/>
		)
		testAsyncComponent(wrapper, done)
	})
})
