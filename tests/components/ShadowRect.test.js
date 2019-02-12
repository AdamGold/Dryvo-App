import { Text } from "react-native"
import React from "react"

import renderer from "react-test-renderer"

import ShadowRect from "../../src/components/ShadowRect"

describe("ShadowRect", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(
				<ShadowRect style={{ minHeight: 320 }}>
					<Text>test</Text>
				</ShadowRect>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
