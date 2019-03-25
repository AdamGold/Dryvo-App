import React from "react"

import renderer from "react-test-renderer"

import SlidingMessage from "../../src/components/SlidingMessage"

describe("SlidingMessage", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(
				<SlidingMessage
					success="success!"
					visible={true}
					close={jest.fn}
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
