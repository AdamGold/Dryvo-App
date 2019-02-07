jest.mock("react-native-firebase", () => {
	return {
		messaging: jest.fn(() => {
			return {
				hasPermission: jest.fn(() => Promise.resolve(true)),
				subscribeToTopic: jest.fn(),
				unsubscribeFromTopic: jest.fn(),
				requestPermission: jest.fn(() => Promise.resolve(true)),
				getToken: jest.fn(() => Promise.resolve("mockToken"))
			}
		}),
		notifications: jest.fn(() => {
			return {
				onNotification: jest.fn(),
				onNotificationDisplayed: jest.fn()
			}
		})
	}
})
