import React from "react"

import renderer from "react-test-renderer"

import StudentPayments from "../../src/components/StudentPayments"

const user = { name: "test", teacher_id: 1, is_approved: true }
describe("StudentPayments", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(
				<StudentPayments
					user={user}
					sum={1000}
					payments={[
						{
							id: 1,
							amount: 100,
							created_at: new Date(Date.UTC("2019-15-03"))
						},
						{
							id: 2,
							amount: 900,
							created_at: new Date(Date.UTC("2019-15-03"))
						}
					]}
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
