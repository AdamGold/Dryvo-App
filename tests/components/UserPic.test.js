import React from "react"
import { Text } from "react-native"
import renderer from "react-test-renderer"

import UserPic from "../../src/components/UserPic"

describe("UserWithPic", () => {
	test("view renders correctly", () => {
		const user = { image: "http://example.com" }
		const tree = renderer
			.create(
				<UserPic
					style={{ width: 100 }}
					width={100}
					height={100}
					user={user}
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
