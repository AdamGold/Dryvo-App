import { Text } from "react-native"
import React from "react"

import renderer from "react-test-renderer"

import NewLessonInput from "../../src/components/NewLessonInput"

describe("NewLessonInput", () => {
	test("view renders correctly", () => {
		const func = jest.fn()
		const tree = renderer
			.create(
				<NewLessonInput
					name={"test"}
					editable={true}
					selectTextOnFocus={false}
					autoFocus={false}
					setRef={func}
					onFocus={func}
					onBlur={func}
					onChangeText={func}
					iconName="done"
					next={func}
					state={{ initial: "test" }}
					iconType="material"
					onSubmitEditing={func}
					extraPlaceholder={"kiwi"}
					style={{ marginTop: 20 }}
					below={func}
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
