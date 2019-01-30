import { REFRESH_TOKEN_KEY, ROOT_URL, TOKEN_KEY } from "../consts"
import Storage from "./Storage"

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
			handling = await this[this._definedExceptions[json.message]]()
			return handling
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
		refresh_token = await Storage.getItem(REFRESH_TOKEN_KEY, true)
		if (!refresh_token) {
			// don't have a refresh token, will have to login again
			return {}
		}
		resp = await fetch(ROOT_URL + "/login/refresh_token", {
			method: "POST",
			body: JSON.stringify({
				refresh_token
			})
		})
		respJSON = await resp.json()
		console.log("response from refresh token " + JSON.stringify(respJSON))
		Storage.setItem(TOKEN_KEY, respJSON["auth_token"], true)
		return { symbol: this._RESEND }
	}

	/* main fetch method --> calls fetch with
    exception handling */
	async fetch(...fetchParams) {
		token = await Storage.getItem(TOKEN_KEY, true)
		fetchParams[1]["headers"] = {
			...this.defaultHeaders,
			...fetchParams[1]["headers"],
			Authorization: "Bearer " + token
		}
		console.log(
			"request to " +
				fetchParams[0] +
				" with data " +
				JSON.stringify(fetchParams[1]) +
				" with requests sent: " +
				this.sentRequests
		)
		resp = await fetch(ROOT_URL + fetchParams[0], fetchParams[1])
		respJSON = await resp.json()
		console.log(
			"response from " + fetchParams[0] + ": " + JSON.stringify(respJSON)
		)
		respJSON = await this._handleExceptions(respJSON)
		if (
			respJSON["symbol"] == this._RESEND &&
			this.sentRequests <= this._requestsLimit
		) {
			this.sentRequests += 1
			return await this.fetch(...fetchParams)
		}
		this.sentRequests = 0 // reset sentRequests
		return { json: respJSON, status: resp.status }
	}
}
