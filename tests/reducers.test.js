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

	it("should handle CHANGE_USER_IMAGE - return user object with `test2` image", () => {
		expect(
			user(
				{ image: "test1" },
				{ type: consts.CHANGE_USER_IMAGE, image: "test2" }
			)
		).toMatchSnapshot()
	})
})

describe("errors reducer", () => {
	it("should return the initial state - return dict of empty arrays with the correct keys", () => {
		expect(errors(undefined, {})).toMatchSnapshot()
	})
	it("should handle ERROR", () => {
		expect(
			errors(undefined, {
				type: consts.ERROR,
				error: "test error"
			})
		).toMatchSnapshot()
	})

	it("should handle ERROR - insert default message if nothing is given", () => {
		expect(
			errors(undefined, {
				type: consts.ERROR
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
