import React from "react"

import renderer from "react-test-renderer"

import StudentNextLessonView from "../../src/components/StudentNextLessonView"
import moment from "moment"

describe("StudentNextLessonView", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(
				<StudentNextLessonView
					lessonPress={jest.fn()}
					testID="test"
					lesson={{
						duration: 40,
						date: new Date("03-14-2019")
					}}
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
