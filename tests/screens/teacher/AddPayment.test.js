import "react-native"
import React from "react"

import renderer from "react-test-renderer"

import { AddPaymentChooseAmount } from "../../../src/screens/teacher/AddPaymentChooseAmount"
import { AddPaymentChooseStudent } from "../../../src/screens/teacher/AddPaymentChooseStudent"

jest.useFakeTimers()
const navigation = {
	getParam: param => {
		if (param == "student") return { student_id: 1, user: { name: "test" } }
	}
}
describe("AddPaymentChooseStudent", () => {
	test("view renders correctly", () => {
		const tree = renderer.create(<AddPaymentChooseStudent />).toJSON()
		expect(tree).toMatchSnapshot()
	})
})

describe("AddPaymentChooseAmount", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(<AddPaymentChooseAmount navigation={navigation} />)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
