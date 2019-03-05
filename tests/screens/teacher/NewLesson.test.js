import "react-native"
import React from "react"
import FetchService from "../../../src/services/Fetch"
import renderer from "react-test-renderer"

import { NewLesson } from "../../../src/screens/teacher/NewLesson"

const fetchService = new FetchService()
describe("NewLesson", () => {
	test("view renders correctly", () => {
		const user = {
			name: "test",
			lesson_duration: 40,
			teacher_id: 1
		}
		const tree = renderer
			.create(
				<NewLesson
					user={user}
					navigation={{
						getParam: jest.fn(),
						goBack: jest.fn(),
						navigate: jest.fn()
					}}
					fetchService={fetchService}
					dispatch={jest.fn()}
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
