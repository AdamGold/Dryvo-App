import {
	REFRESH_TOKEN_KEY,
	ROOT_URL,
	TOKEN_KEY,
	DEFAULT_ERROR
} from "../consts"
import Storage from "./Storage"
import { APIError } from "../error_handling"

export default class Fetch {
	_definedExceptions = {
		BLACKLISTED_TOKEN: "_handleExpiredToken",
		EXPIRED_TOKEN: "_handleExpiredToken"
	}
	_RESEND = Symbol("RESEND")
	_requestsLimit = 2 // limit to maximum 2 re-fetches

	constructor() {
		this.sentRequests = 0
		this.defaultHeaders = {
			Accept: "application/json",
			"Content-Type": "application/json"
		}
	}

	/*
    General exception manager.
    Checks for every known exception we might get
    from our server and calls the corresponding method
    */
	async _handleExceptions(json) {
		if (this._definedExceptions.hasOwnProperty(json.message)) {
			return await this[this._definedExceptions[json.message]]()
		}
		return json
	}

	/*
    Handle expired tokens.
    Send request to refresh the token,
    and re-send the original request.
    */
	async _handleExpiredToken() {
		console.log("handling expired token")
		const refresh_token = await Storage.getItem(REFRESH_TOKEN_KEY, true)
		if (!refresh_token) {
			// don't have a refresh token, will have to login again
			return {}
		}
		console.log("we have a valid refresh token")
		const resp = await fetch(ROOT_URL + "/login/refresh_token", {
			method: "POST",
			headers: this.defaultHeaders,
			body: JSON.stringify({
				refresh_token
			})
		})
		const respJSON = await resp.json()
		this._throwError(resp.status, respJSON)
		// console.log("response from refresh token " + JSON.stringify(respJSON))
		await Storage.setItem(TOKEN_KEY, respJSON["auth_token"], true)
		return { symbol: this._RESEND }
	}

	_throwError(status, json) {
		if (400 <= status && status < 600) {
			// we have an error
			let msg = json
			if (msg.hasOwnProperty("message")) msg = msg.message
			throw new APIError(msg)
		}
	}
	/* main fetch method --> calls fetch with
    exception handling */
	async fetch(...fetchParams) {
		if (this.sentRequests > this._requestsLimit) {
			this.sentRequests = 0
			throw new APIError(DEFAULT_ERROR)
		}
		const token = await Storage.getItem(TOKEN_KEY, true)
		fetchParams[1]["headers"] = {
			...this.defaultHeaders,
			...fetchParams[1]["headers"],
			Authorization: "Bearer " + token
		}
		/*console.log(
			"request to " +
				fetchParams[0] +
				" with data " +
				JSON.stringify(fetchParams[1]) +
				" with requests sent: " +
				this.sentRequests
		)*/
		const resp = await fetch(ROOT_URL + fetchParams[0], fetchParams[1])
		let respJSON = await resp.json()
		/*console.log(
			"response from " + fetchParams[0] + ": " + JSON.stringify(respJSON)
		)*/
		respJSON = await this._handleExceptions(respJSON)
		if (
			respJSON.hasOwnProperty("symbol") &&
			respJSON["symbol"] == this._RESEND
		) {
			this.sentRequests += 1
			return await this.fetch(...fetchParams)
		}
		this.sentRequests = 0 // reset sentRequests
		this._throwError(resp.status, respJSON)
		return { json: respJSON, status: resp.status }
	}
}
