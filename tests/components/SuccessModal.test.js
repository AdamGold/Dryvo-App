import React from "react"

import renderer from "react-test-renderer"

import SuccessModal from "../../src/components/SuccessModal"

describe("SuccessModal", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(
				<SuccessModal
					visible={true}
					image="lesson"
					title="test"
					desc="desc test"
					button="button test"
					buttonPress={jest.fn}
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
