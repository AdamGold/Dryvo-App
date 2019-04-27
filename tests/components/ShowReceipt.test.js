import React from "react"

import renderer from "react-test-renderer"

import ShowReceipt from "../../src/components/ShowReceipt"

const teacher = { name: "test", teacher_id: 1 }
const student = { name: "student", my_teacher: teacher }
const item1 = { amount: 100, details: "test", payment_type: "cash" }
const item2 = {
	amount: 100,
	details: "test",
	payment_type: "cash",
	pdf_link: "http://test.com"
}
describe("ShowReceipt", () => {
	test("view renders correctly for student", () => {
		const tree = renderer
			.create(<ShowReceipt user={student} item={item2} />)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test("view renders correctly for teacher", () => {
		const tree = renderer
			.create(<ShowReceipt user={teacher} item={item1} />)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test("view renders correctly for student without actual pdf link (should be empty view)", () => {
		const tree = renderer
			.create(<ShowReceipt user={student} item={item1} />)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
