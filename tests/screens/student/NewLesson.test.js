import "react-native"
import React from "react"
import FetchService from "../../../src/services/Fetch"
import renderer from "react-test-renderer"

import { NewLesson } from "../../../src/screens/student/NewLesson"

const fetchService = new FetchService()
jest.useFakeTimers()
describe("NewLesson", () => {
	test.skip("view renders correctly", () => {
		const user = {
			name: "test"
		}
		const tree = renderer
			.create(
				<NewLesson
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
