import React from "react"

import renderer from "react-test-renderer"

import AuthInput from "../../src/components/AuthInput"

describe("AuthInput", () => {
	test("view renders correctly", () => {
		const func = jest.fn()
		const tree = renderer
			.create(
				<AuthInput
					name={"test"}
					value="test"
					placeholder="test"
					autoFocus={false}
					onFocus={func}
					onBlur={func}
					onChangeText={func}
					iconName="done"
					secureTextEntry={true}
					testID="test"
					errorMessage="error"
					validation={func}
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
