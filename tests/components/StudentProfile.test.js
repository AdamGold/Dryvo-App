import React from "react"

import renderer from "react-test-renderer"
import FetchService from "../../src/services/Fetch"
import StudentProfile from "../../src/components/StudentProfile"

const fetchService = new FetchService()
const student = {
	student_id: 1,
	balance: 900,
	user: { name: "test" },
	my_teacher: { user: {} }
}
const navigation = {
	navigate: jest.fn(),
	getParam: jest.fn(),
	addListener: jest.fn()
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
const nextLesson = [{ id: 1 }]
fetch.mockResponseSuccess(
	JSON.stringify({
		data: topics
	})
)
jest.useFakeTimers()
describe("StudentProfile", () => {
	test("view renders correctly -> teacher's view", () => {
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
		const tree = renderer
			.create(
				<StudentProfile
					user={{
						...student,
						teacher_id: 1
					}}
					navigation={navigation}
					fetchService={fetchService}
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test("view renders correctly -> student's view", () => {
		const tree = renderer
			.create(
				<StudentProfile
					user={student}
					navigation={navigation}
					fetchService={fetchService}
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
