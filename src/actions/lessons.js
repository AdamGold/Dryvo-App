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

export async function getPayments(fetchService) {
	const date = new Date()
	var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
	var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
	const resp = await fetchService.fetch(
		"/lessons/payments?order_by=created_at desc&created_at=ge:" +
			firstDay.toISOString() +
			"&created_at=le:" +
			lastDay.toISOString(),
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
}
