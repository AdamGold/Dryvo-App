import React from "react"

import renderer from "react-test-renderer"

import SimpleLoader from "../../src/components/SimpleLoader"
import LessonsLoader from "../../src/components/LessonsLoader"
import StudentsLoader from "../../src/components/StudentsLoader"
import PaymentsLoader from "../../src/components/PaymentsLoader"

describe("SimpleLoader", () => {
	test("view renders correctly", () => {
		const tree = renderer
			.create(<SimpleLoader height={100} width={240} />)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})

describe("LessonsLoader", () => {
	test("view renders correctly", () => {
		const tree = renderer.create(<LessonsLoader />).toJSON()
		expect(tree).toMatchSnapshot()
	})
})

describe("StudentsLoader", () => {
	test("view renders correctly", () => {
		const tree = renderer.create(<StudentsLoader />).toJSON()
		expect(tree).toMatchSnapshot()
	})
})

describe("PaymentsLoader", () => {
	test("view renders correctly", () => {
		const tree = renderer.create(<PaymentsLoader />).toJSON()
		expect(tree).toMatchSnapshot()
	})
})
