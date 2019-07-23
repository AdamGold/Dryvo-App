import moment from "moment"

export function getDateAndString(date) {
	let timestamp
	let dateString
	if (date.hasOwnProperty("timestamp")) {
		timestamp = date.timestamp
		dateString = date.dateString
	} else {
		timestamp = date.getTime()
		dateString = date.toJSON().slice(0, 10)
	}
	const momentDate = moment
		.unix(timestamp / 1000) // division by 1000 to get epoch https://stackoverflow.com/questions/3367415/get-epoch-for-a-specific-date-using-javascript
		.utc()

	return { date: momentDate, dateString }
}

export async function getPayments(fetchService, forMonth = true, extra = "") {
	let forMonthURL = ""
	if (forMonth) {
		const date = new Date()
		var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
		var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
		forMonthURL = `&created_at=ge:${firstDay.toISOString()}&created_at=le:${lastDay.toISOString()}`
	}
	if (extra) extra = `&${extra}`
	try {
		const resp = await fetchService.fetch(
			`/appointments/payments?order_by=created_at desc${forMonthURL}${extra}`,
			{ method: "GET" }
		)
		var sum = 0
		for (var i = 0, _len = resp.json["data"].length; i < _len; i++) {
			sum += resp.json["data"][i]["amount"]
		}

		return {
			payments: resp.json["data"],
			sum
		}
	} catch (error) {
		return { payments: [], sum: 0 }
	}
}

export async function getLessonById(fetchService, id) {
	try {
		const resp = await fetchService.fetch(`/appointments/${id}`, {
			method: "GET"
		})
		return resp.json["data"]
	} catch (error) {
		return null
	}
}
