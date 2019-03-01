import { Text } from "react-native"
import React from "react"

import renderer from "react-test-renderer"

import InputSelectionButton from "../../src/components/InputSelectionButton"

describe("InputSelectionButton", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(
				<InputSelectionButton onPress={() => "test"} selected={true}>
					<Text>test</Text>
				</InputSelectionButton>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
