import * as error_handling from "../src/error_handling"

test("APIError test", () => {
	const error = new error_handling.APIError("howdy")
	expect(error.message).toBe("howdy")
})
