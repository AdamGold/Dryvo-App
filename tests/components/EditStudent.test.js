import React from "react"

import renderer from "react-test-renderer"
import FetchService from "../../src/services/Fetch"
import EditStudent from "../../src/components/EditStudent"

const fetchService = new FetchService()
const student = {
	student_id: 1,
	balance: 900,
	user: { name: "test" },
	my_teacher: { user: {} },
	number_of_old_lessons: 4,
	eyes_check: true,
	doctor_check: false
}
const navigation = {
	navigate: jest.fn(),
	getParam: param => student,
	addListener: jest.fn()
}
jest.useFakeTimers()
describe("EditStudent", () => {
	test("view renders correctly -> teacher's view", () => {
		const tree = renderer
			.create(
				<EditStudent
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
				<EditStudent
					user={student}
					navigation={navigation}
					fetchService={fetchService}
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
