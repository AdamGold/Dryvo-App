import React from "react"

import renderer from "react-test-renderer"

import NotificationButtons from "../../src/screens/teacher/NotificationButtons"

describe("NotificationButtons", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(
				<NotificationButtons
					style={{ height: 30 }}
					name="test"
					type="new_lesson"
					date="test"
					hours="test-test"
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
