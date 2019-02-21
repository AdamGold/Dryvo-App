jest.mock("react-native-push-notification", () => {
	return {
		configure: jest.fn(),
		localNotification: jest.fn()
	}
})
