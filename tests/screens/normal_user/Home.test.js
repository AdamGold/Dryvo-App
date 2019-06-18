import "react-native"
import React from "react"
import FetchService from "../../../src/services/Fetch"
import renderer from "react-test-renderer"

import { Home } from "../../../src/screens/normal_user/Home"

describe("Home", () => {
	test("view renders correctly for teacher", done => {
		const user = { name: "test", teacher_id: 1, area: "haifa" }

		const wrapper = shallow(
			<Home
				navigation={navigation}
				user={user}
				fetchService={fetchService}
				dispatch={dispatch}
			/>
		)
		testAsyncComponent(wrapper, done)
	})
	test("view renders correctly for student", done => {
		const user = {
			name: "test2",
			area: "haifa",
			my_teacher: { user: { name: "teacher" }, teacher_id: 1 }
		}
		const wrapper = shallow(
			<Home
				navigation={navigation}
				user={user}
				fetchService={fetchService}
				dispatch={dispatch}
			/>
		)
		testAsyncComponent(wrapper, done)
	})
	test("view renders correctly for user without area yet (should show form)", done => {
		const user = {
			name: "test2",
			my_teacher: { user: { name: "teacher" }, teacher_id: 1 }
		}
		const wrapper = shallow(
			<Home
				navigation={navigation}
				user={user}
				fetchService={fetchService}
				dispatch={dispatch}
			/>
		)
		testAsyncComponent(wrapper, done)
	})
})
