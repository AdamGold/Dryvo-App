import { Text } from "react-native"
import React from "react"

import renderer from "react-test-renderer"

import Notification from "../../src/components/Notification"

describe("Notification", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(
				<Notification
					style={{ height: 30 }}
					name="test"
					type="new_lesson"
					date="test"
					hours="test-test"
				>
					<Text>Hello</Text>
				</Notification>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
