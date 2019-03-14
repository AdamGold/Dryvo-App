import React from "react"

import renderer from "react-test-renderer"

import TopicsList from "../../src/components/TopicsList"

describe("TopicsList", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(
				<TopicsList
					topics={[
						{ id: 1, title: "test1" },
						{ id: 2, title: "test2" }
					]}
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
