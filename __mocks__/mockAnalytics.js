jest.mock("appcenter-analytics", () => {
	return {
		trackEvent: jest.fn()
	}
})
