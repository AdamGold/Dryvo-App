import "react-native"
import React from "react"
import FetchService from "../../../src/services/Fetch"
import renderer from "react-test-renderer"

import { Home } from "../../../src/screens/normal_user/Home"

const fetchService = new FetchService()
jest.useFakeTimers()
describe("Home", () => {
	test("view renders correctly for teacher", () => {
		const user = { name: "test", teacher_id: 1 }

		const tree = renderer
			.create(<Home user={user} fetchService={fetchService} />)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
	test("view renders correctly for student", () => {
		const user = {
			name: "test2",
			my_teacher: { user: { name: "teacher" }, teacher_id: 1 }
		}
		const tree = renderer
			.create(<Home user={user} fetchService={fetchService} />)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
