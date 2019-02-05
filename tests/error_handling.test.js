import * as error_handling from "../src/error_handling"

test("APIError test", () => {
	const error = new error_handling.APIError("howdy")
	expect(error.message).toBe("howdy")
})

test("getLatestError test", () => {
	const error = error_handling.getLatestError([1, 2, 3])
	expect(error).toEqual(3)
})
