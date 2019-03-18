import "react-native"
import React from "react"

import renderer from "react-test-renderer"
import FetchService from "../../../src/services/Fetch"
import { Students } from "../../../src/screens/teacher/Students"

const fetchService = new FetchService()
jest.useFakeTimers()
describe("Students", () => {
	test("view renders correctly", () => {
		fetch.mockResponseSuccess(
			JSON.stringify({
				data: [
					{ student_id: 1, user: { name: "test1" } },
					{ student_id: 2, user: { name: "test2" } }
				],
				next_url: ""
			})
		)
		const tree = renderer.create(
			<Students
				fetchService={fetchService}
				navigation={{ addListener: jest.fn() }}
			/>
		)

		expect(tree.toJSON()).toMatchSnapshot()
	})
})
