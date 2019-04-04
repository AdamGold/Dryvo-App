import "react-native"
import React from "react"
import FetchService from "../../../src/services/Fetch"
import renderer from "react-test-renderer"

import { Home } from "../../../src/screens/teacher/Home"

const fetchService = new FetchService()
const navigation = {
	addListener: jest.fn()
}
jest.useFakeTimers()
describe("Home", () => {
	test("view renders correctly", () => {
		const user = { name: "test" }
		const student = { user }
		fetch.mockResponseSuccess(
			JSON.stringify({
				data: [
					{
						student,
						dropoff_place: { name: "t" },
						meetup_place: { name: "a" }
					}
				]
			})
		)
		fetch.mockResponseSuccess(
			JSON.stringify({ data: [{ amount: 100, student }] })
		)
		const tree = renderer
			.create(
				<Home
					navigation={navigation}
					user={user}
					fetchService={fetchService}
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
