import React from "react"
import { Text } from "react-native"
import renderer from "react-test-renderer"

import UserWithPic from "../../src/components/UserWithPic"

describe("UserWithPic", () => {
	test("view renders correctly", () => {
		const url = "http://example.com"
		const tree = renderer
			.create(
				<UserWithPic
					style={{ width: 100 }}
					width={100}
					height={100}
					img={url}
					nameStyle={{ maxHeight: 30 }}
					extra={<Text>test</Text>}
					name="test"
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
