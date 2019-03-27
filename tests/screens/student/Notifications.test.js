import "react-native"
import React from "react"

import renderer from "react-test-renderer"

import { Notifications } from "../../../src/screens/student/Notifications"

describe("Notifications", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(
				<Notifications
					navigation={{
						getParam: param => {
							return "lessons"
						},
						goBack: jest.fn(),
						navigate: jest.fn()
					}}
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
