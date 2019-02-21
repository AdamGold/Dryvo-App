import FetchService from "../src/services/Fetch"
import { REFRESH_TOKEN_KEY, DEFAULT_ERROR } from "../src/consts"
import Storage from "../src/services/Storage"

const _mockExpiredToken = () => {
	fetch.mockResponseSuccess(JSON.stringify({ message: "EXPIRED_TOKEN" }), 401)
}
let fetchService
describe("Fetch", () => {
	beforeAll(() => {
		fetchService = new FetchService()
	})
	it("should request once", async () => {
		fetch.mockResponseSuccess(JSON.stringify({ test: "test" }), 999)
		const resp = await fetchService.fetch("/endpoint", {})

		expect(resp.status).toEqual(999)
	})

	it("should request 3 times", async () => {
		_mockExpiredToken()
		await Storage.setItem(REFRESH_TOKEN_KEY, "refresh-tst", true)
		fetch.mockResponseSuccess(
			JSON.stringify({ auth_token: "auth-test" }),
			200
		)
		_mockExpiredToken()
		fetch.mockResponseSuccess(
			JSON.stringify({ auth_token: "auth-test" }),
			200
		)
		fetch.mockResponseSuccess(JSON.stringify({ test: "test" }), 999)
		const resp = await fetchService.fetch("/endpoint", {})
		console.log(resp)

		expect(resp.status).toEqual(999)
	})

	it("more than 2 expired token responses --> should fail", async () => {
		_mockExpiredToken()
		await Storage.setItem(REFRESH_TOKEN_KEY, "refresh-tst", true)
		fetch.mockResponseSuccess(
			JSON.stringify({ auth_token: "auth-test-1" }),
			200
		)
		_mockExpiredToken()
		fetch.mockResponseSuccess(
			JSON.stringify({ auth_token: "auth-test-2" }),
			200
		)
		_mockExpiredToken()
		fetch.mockResponseSuccess(
			JSON.stringify({ auth_token: "auth-test-3" }),
			200
		)
		// no more requests allowed
		try {
			await fetchService.fetch("/endpoint", {})
		} catch (error) {
			expect(error.message).toEqual(DEFAULT_ERROR)
		}
	})

	it("should throw APIError", async () => {
		fetch.mockResponseSuccess(JSON.stringify({ message: "test" }), 400)
		try {
			await fetchService.fetch("/endpoint", {})
		} catch (error) {
			expect(error.message).toEqual("test")
		}
	})
})
