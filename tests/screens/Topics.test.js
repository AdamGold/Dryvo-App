import React from "react"

import renderer from "react-test-renderer"
import { Topics } from "../../src/screens/Topics"

const topics = {
	new: [],
	in_progress: [{ id: 1, title: "test1" }],
	finished: [{ id: 2, title: "test2" }, { id: 3, title: "test3" }]
}

describe("Topics", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(
				<Topics
					navigation={{ ...navigation, getParam: param => topics }}
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
