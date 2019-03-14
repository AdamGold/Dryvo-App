import "react-native"
import React from "react"
import FetchService from "../../../src/services/Fetch"
import renderer from "react-test-renderer"

import { Lesson } from "../../../src/screens/student/Lesson"

const fetchService = new FetchService()
jest.useFakeTimers()
describe("Lesson", () => {
	test.skip("view renders correctly", () => {
		const user = {
			name: "test"
		}
		const tree = renderer
			.create(
				<Lesson
					user={user}
					navigation={{
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
