import { Text } from "react-native"
import React from "react"

import renderer from "react-test-renderer"

import Row from "../../src/components/Row"

describe("Row", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(
				<Row leftSide={<Text>Test</Text>} style={{ maxHeight: 30 }}>
					<Text>test</Text>
				</Row>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
