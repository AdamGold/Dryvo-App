import "react-native"
import React from "react"

import renderer from "react-test-renderer"
import FetchService from "../../../src/services/Fetch"
import { WorkDays } from "../../../src/screens/teacher/WorkDays"

const fetchService = new FetchService()
jest.useFakeTimers()
// currently it will only render loading,
// until we fix the async tests
describe("WorkDays", () => {
	test("view renders correctly", () => {
		const tree = renderer.create(
			<WorkDays
				fetchService={fetchService}
				navigation={{ getParam: jest.fn() }}
			/>
		)

		expect(tree.toJSON()).toMatchSnapshot()
	})
})
