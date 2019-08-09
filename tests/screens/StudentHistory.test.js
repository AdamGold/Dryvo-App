import React from "react"

import { StudentHistory } from "../../src/screens/StudentHistory"

const user = { name: "test", area: "test", phone: "05501111", price: 1000 }
const student = {
	...user,
	student_id: 1,
	balance: 900,
	my_teacher: { user: {} }
}
describe("StudentHistory", () => {
	test("view renders correctly", done => {
		fetch.mockResponseSuccess(
			JSON.stringify({
				data: [
					{
						student,
						dropoff_place: "t",
						meetup_place: "a"
					}
				]
			})
		)
		const wrapper = shallow(
			<StudentHistory
				user={user}
				navigation={{ ...navigation, getParam: param => 1 }}
				dispatch={dispatch}
				fetchService={fetchService}
			/>
		)
		testAsyncComponent(wrapper, done)
	})
})
