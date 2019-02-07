import user from "../src/reducers/user"
import errors from "../src/reducers/errors"
import fetch from "../src/reducers/fetch"
import * as consts from "../src/reducers/consts"

describe("user reducer", () => {
	it("should return the initial state", () => {
		expect(user(undefined, {})).toEqual(null)
	})

	it("should handle LOGIN - return user object", () => {
		expect(
			user(null, {
				type: consts.LOGIN,
				user: {
					name: "test"
				}
			})
		).toMatchSnapshot()
	})

	it("should handle LOGOUT - return null", () => {
		expect(
			user(null, {
				type: consts.LOGOUT
			})
		).toMatchSnapshot()
	})
})

describe("errors reducer", () => {
	it("should return the initial state - return dict of empty arrays with the correct keys", () => {
		expect(errors(undefined, {})).toMatchSnapshot()
	})
	const initialState = {
		[consts.API_ERROR]: [],
		other: []
	}
	it("should handle API ERROR - insert `test error` to array", () => {
		expect(
			errors(initialState, {
				type: consts.API_ERROR,
				error: "test error"
			})
		).toMatchSnapshot()
	})

	it("should handle API ERROR - insert default message if empty is given", () => {
		expect(
			errors(initialState, {
				type: consts.API_ERROR,
				error: ""
			})
		).toMatchSnapshot()
	})

	const filledWithErrors = Object.assign({}, initialState, {
		[consts.API_ERROR]: ["test 1", "test 2"]
	})
	it("should handle POP ERROR and pop from array - return only `test 1` in array", () => {
		expect(
			errors(filledWithErrors, {
				type: consts.POP_ERROR,
				errorType: consts.API_ERROR
			})
		).toMatchSnapshot()
	})
})

describe("fetch reducer", () => {
	it("should return the initial state", () => {
		expect(fetch(undefined, {})).toEqual(null)
	})

	it("should handle LOAD FETCH SERVICE - return `Fetch` object", () => {
		expect(
			fetch(null, {
				type: consts.LOAD_FETCH_SERVICE
			})
		).toMatchSnapshot()
	})
})
