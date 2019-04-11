import React from "react"

import renderer from "react-test-renderer"
import { Settings } from "../../src/screens/Settings"

const navigation = { navigate: jest.fn(), getParam: param => topics }

describe("Settings", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(
				<Settings
					user={{ name: "test", area: "testa" }}
					navigation={navigation}
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
