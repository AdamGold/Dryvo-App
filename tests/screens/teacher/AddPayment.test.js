import "react-native"
import React from "react"

import renderer from "react-test-renderer"

import { AddPaymentChooseAmount } from "../../../src/screens/teacher/AddPaymentChooseAmount"
import { AddPaymentChooseStudent } from "../../../src/screens/teacher/AddPaymentChooseStudent"

const newNavigation = {
	...navigation,
	getParam: param => {
		if (param == "student") return { student_id: 1, name: "test" }
	}
}
describe("AddPaymentChooseStudent", () => {
	test("view renders correctly", done => {
		fetch.mockResponseSuccess(
			JSON.stringify({
				data: [
					{ student_id: 1, name: "test1" },
					{ student_id: 2, name: "test2" },
					{ student_id: 3, name: "test3" }
				]
			})
		)
		const wrapper = shallow(<AddPaymentChooseStudent dispatch={dispatch} />)
		testAsyncComponent(wrapper, done)
	})
})

describe("AddPaymentChooseAmount", () => {
	test("view renders correctly", done => {
		const wrapper = shallow(
			<AddPaymentChooseAmount
				navigation={newNavigation}
				dispatch={dispatch}
			/>
		)
		testAsyncComponent(wrapper, done)
	})
})
