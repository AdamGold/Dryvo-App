import "react-native"
import React from "react"
import FetchService from "../../../src/services/Fetch"
import renderer from "react-test-renderer"

import { Lesson } from "../../../src/screens/teacher/Lesson"

const fetchService = new FetchService()
const user = {
	name: "test",
	lesson_duration: 40,
	teacher_id: 1
}
describe("Lesson", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(
				<Lesson
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

	test("view renders correctly with existing lesson", () => {
		const lesson = {
			date: new Date(Date.UTC("03-14-2019")),
			duration: 80,
			student: { id: 1, user }
		}
		const tree = renderer
			.create(
				<Lesson
					user={user}
					navigation={{
						getParam: param => {
							return { lesson }[param]
						},
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
