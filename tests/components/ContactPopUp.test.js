import React from "react"

import renderer from "react-test-renderer"

import ContactPopup from "../../src/components/ContactPopup"

jest.useFakeTimers()
describe("ContactPopup", () => {
	test("view renders correctly", () => {
		const phone = "0542224441"
		const tree = renderer
			.create(
				<ContactPopup
					visible={true}
					phone={phone}
					onPress={jest.fn()}
					testID="test"
				/>
			)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
