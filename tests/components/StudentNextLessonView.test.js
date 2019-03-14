import React from "react"

import renderer from "react-test-renderer"

import StudentNextLessonView from "../../src/components/StudentNextLessonView"

describe("StudentNextLessonView", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(
				<StudentNextLessonView
					lessonPress={jest.fn()}
					testID="test"
					lesson={{ duration: 40, date: new Date("2019-01-01") }}
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
