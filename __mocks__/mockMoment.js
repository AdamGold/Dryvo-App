jest.mock("moment", () => {
	const moment = require.requireActual("moment")
	return moment.locale("en-US")
})
