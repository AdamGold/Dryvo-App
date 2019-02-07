import * as utils from "../src/actions/utils"
import * as auth from "../src/actions/auth"
import FetchService from "../src/services/Fetch"
import Storage from "../src/services/Storage"
import { Platform } from "react-native"
import mockStore from "redux-mock-store"
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from "../src/consts"

let user, store
beforeAll(() => {
	user = { id: 1, name: "test" }
})
beforeEach(() => {
	store = mockStore({ fetchService: new FetchService(), user })
})
describe("utils.js", () => {
	it("should return load fetch service", () => {
		expect(utils.loadFetchService()).toMatchSnapshot()
	})

	it("should set linking listener", async () => {
		const func = jest.fn()
		Platform.OS = "android"
		await utils.deepLinkingListener(func)
		expect(func).toBeCalled()
	})
})

describe("auth.js", () => {
	describe("fetchUser test", () => {
		const callback = jest.fn(user => {
			console.log(user)
		})
		it("should (dispatch LOGIN & call callback with user)", async () => {
			fetch.mockResponseSuccess(JSON.stringify({ user }))
			await store.dispatch(auth.fetchUser(callback))
			expect(callback).toHaveBeenCalledWith(
				expect.objectContaining({ name: user.name })
			)
			expect(store.getActions()).toMatchSnapshot()
		})
		it("should call callback with undefined", async () => {
			fetch.mockResponseFailure()
			await store.dispatch(auth.fetchUser(callback))
			expect(callback).toHaveBeenLastCalledWith(expect.undefined)
		})
	})

	describe("exchangeToken tests", () => {
		const callback = jest.fn(user => {
			console.log(user)
		})
		it("should dispatch error", async () => {
			fetch.mockResponseFailure()
			await store.dispatch(auth.exchangeToken("exchange-token", callback))
			expect(store.getActions()).toMatchSnapshot()
			store.clearActions()
		})
		it("should set tokens and dispatch login user", async () => {
			const response = {
				auth_token: "auth-test",
				refresh_token: "refresh-test"
			}
			fetch.mockResponseSuccess(JSON.stringify(response))
			fetch.mockResponseSuccess(JSON.stringify({ user }))
			await store.dispatch(auth.exchangeToken("exchange-token", callback))
			const token = await Storage.getItem(TOKEN_KEY, true)
			const refresh = await Storage.getItem(REFRESH_TOKEN_KEY, true)
			expect(token).toEqual("auth-test")
			expect(refresh).toEqual("refresh-test")
			expect(store.getActions()).toMatchSnapshot()
		})
	})

	describe("logout tests", () => {
		it("should dispatch logout and remove tokens", async () => {
			const callback = jest.fn(() => {})
			let ret = await store.dispatch(auth.logout(callback))
			expect(callback).toBeCalled()
			const token = await Storage.getItem(TOKEN_KEY, true)
			const refresh = await Storage.getItem(REFRESH_TOKEN_KEY, true)
			expect(token).toEqual(null)
			expect(refresh).toEqual(null)
			expect(store.getActions()).toMatchSnapshot()
		})
	})

	describe("register tests", () => {
		const callback = jest.fn()
		const response = {
			user: { id: 1, name: "test" },
			auth_token: "auth-test",
			refresh_token: "refresh-test"
		}
		it("should set tokens, dispatch login user and call callback", async () => {
			fetch.mockResponseSuccess(JSON.stringify(response))
			let ret = await store.dispatch(
				auth.register(
					{
						email: "t@t.com",
						name: "t",
						area: "t",
						password: "test"
					},
					callback
				)
			)
			expect(callback).toHaveBeenCalled()
			const token = await Storage.getItem(TOKEN_KEY, true)
			const refresh = await Storage.getItem(REFRESH_TOKEN_KEY, true)
			expect(token).toEqual("auth-test")
			expect(refresh).toEqual("refresh-test")
			expect(store.getActions()).toMatchSnapshot()
			store.clearActions()
		})

		it("should dispatch default error", async () => {
			fetch.mockResponseFailure()
			let ret = await store.dispatch(auth.register({}, callback))
			expect(store.getActions()).toMatchSnapshot()
		})
	})

	describe("directLogin tests", () => {
		const callback = jest.fn()
		const response = {
			user: { id: 1, name: "test" },
			auth_token: "auth-test",
			refresh_token: "refresh-test"
		}
		it("should set tokens, dispatch login user and call callback", async () => {
			fetch.mockResponseSuccess(JSON.stringify(response))
			let ret = await store.dispatch(
				auth.directLogin("t@t.com", "test", callback)
			)
			expect(callback).toHaveBeenCalled()
			const token = await Storage.getItem(TOKEN_KEY, true)
			const refresh = await Storage.getItem(REFRESH_TOKEN_KEY, true)
			expect(token).toEqual("auth-test")
			expect(refresh).toEqual("refresh-test")
			expect(store.getActions()).toMatchSnapshot()
			store.clearActions()
		})

		it("should dispatch default error", async () => {
			fetch.mockResponseFailure()
			let ret = await store.dispatch(auth.directLogin({}, callback))
			expect(store.getActions()).toMatchSnapshot()
		})
	})
})
