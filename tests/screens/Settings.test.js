import React from "react"

import renderer from "react-test-renderer"
import { Settings } from "../../src/screens/Settings"

const navigation = { navigate: jest.fn(), getParam: param => topics }
const user = { name: "test", area: "test" }
const student = {
	user,
	student_id: 1,
	balance: 900,
	my_teacher: { user: {} }
}
const teacher = { user, teacher_id: 5, price: 100, lesson_duration: 40 }
describe("Settings", () => {
	test("view renders correctly for student", () => {
		const tree = renderer
			.create(<Settings user={student} navigation={navigation} />)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test("view renders correctly for teacher", () => {
		const tree = renderer
			.create(<Settings user={teacher} navigation={navigation} />)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
