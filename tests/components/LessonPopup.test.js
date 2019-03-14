import { Text } from "react-native"
import React from "react"

import renderer from "react-test-renderer"

import LessonPopup from "../../src/components/LessonPopup"

describe("LessonPopup", () => {
	test("view renders correctly", () => {
		const item = {
			date: "Sun, 23 Jun 2019 10:09:25 GMT",
			duration: "40",
			student: { user: { name: "test" } }
		}
		const tree = renderer
			.create(
				<LessonPopup
					visible={true}
					item={item}
					onPress={jest.fn()}
					testID="test"
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
