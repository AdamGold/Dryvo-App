import moment from "moment"

export function getStartAndEndOfDay(date) {
	let timestamp
	let dateString
	if (date.hasOwnProperty("timestamp")) {
		timestamp = date.timestamp
		dateString = date.dateString
	} else {
		timestamp = date.getTime()
		dateString = date.toJSON().slice(0, 10)
	}
	const startOfDay = moment
		.unix(timestamp / 1000) // division by 1000 to get epoch https://stackoverflow.com/questions/3367415/get-epoch-for-a-specific-date-using-javascript
		.utc()
		.startOf("day")
	const endOfDay = moment
		.unix(timestamp / 1000)
		.utc()
		.endOf("day")

	return { startOfDay, endOfDay, dateString }
}
