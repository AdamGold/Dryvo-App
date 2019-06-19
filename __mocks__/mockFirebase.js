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
		}),
		analytics: jest.fn(() => {
			return {
				setUserId: jest.fn(),
				setUserProperty: jest.fn(),
				setCurrentScreen: jest.fn(),
				setAnalyticsCollectionEnabled: jest.fn(),
				logEvent: jest.fn()
			}
		})
	}
})
