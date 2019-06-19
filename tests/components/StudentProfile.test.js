import React from "react"

import StudentProfile from "../../src/components/StudentProfile"

const student = {
	student_id: 1,
	balance: 900,
	name: "test",
	my_teacher: {
		user: { id: 2, name: "teacher" },
		teacher_id: 2,
		is_approved: true
	}
}
const topics = {
	new: [],
	in_progress: [{ id: 1, title: "test1" }],
	finished: [{ id: 2, title: "test2" }, { id: 3, title: "test3" }]
}
const payments = [
	{ id: 1, amount: 100, details: "test", pdf_link: "http://test.com" },
	{ id: 1, amount: 100, details: "test" }
]
const nextLesson = [{ id: 1, duration: 40 }]
fetch.mockResponseSuccess(
	JSON.stringify({
		data: topics
	})
)
fetch.mockResponseSuccess(
	JSON.stringify({
		data: nextLesson
	})
)
fetch.mockResponseSuccess(
	JSON.stringify({
		data: payments
	})
)
describe("StudentProfile", () => {
	test("view renders correctly -> teacher's view", done => {
		const wrapper = shallow(
			<StudentProfile
				user={student.my_teacher}
				navigation={{ ...navigation, getParam: _ => student }}
				fetchService={fetchService}
				dispatch={dispatch}
			/>
		)
		testAsyncComponent(wrapper, done)
	})

	test("view renders correctly -> student's view", done => {
		const wrapper = shallow(
			<StudentProfile
				user={student}
				navigation={{ ...navigation, getParam: jest.fn() }}
				fetchService={fetchService}
				dispatch={dispatch}
			/>
		)
		testAsyncComponent(wrapper, done)
	})
})
