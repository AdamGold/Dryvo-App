import React from "react"

import renderer from "react-test-renderer"

import StudentPayments from "../../src/components/StudentPayments"

describe("StudentPayments", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(
				<StudentPayments
					sum={1000}
					payments={[{ id: 1, amount: 100 }, { id: 2, amount: 900 }]}
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
