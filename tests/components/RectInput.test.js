import { Text } from "react-native"
import React from "react"

import renderer from "react-test-renderer"

import RectInput from "../../src/components/RectInput"

describe("RectInput", () => {
	test("view renders correctly", () => {
		const func = jest.fn()
		const tree = renderer
			.create(
				<RectInput
					name={"test"}
					autoFocus={false}
					onFocus={func}
					onBlur={func}
					onChangeText={func}
					iconName="done"
					iconType="material"
					onSubmitEditing={func}
					style={{ marginTop: 20 }}
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
