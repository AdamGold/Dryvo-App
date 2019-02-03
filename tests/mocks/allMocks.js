jest.mock("rn-secure-storage", () => {
	return {
		get: jest.fn(() => {
			return "test-key"
		}),
		set: jest.fn(() => {
			return true
		}),
		remove: jest.fn(() => {
			return true
		}),
		ACCESSBILE: jest.fn(() => {
			return {
				WHEN_UNLOCKED: "AccessibleWhenUnlocked",
				AFTER_FIRST_UNLOCK: "AccessibleAfterFirstUnlock",
				ALWAYS: "AccessibleAlways",
				WHEN_PASSCODE_SET_THIS_DEVICE_ONLY:
					"AccessibleWhenPasscodeSetThisDeviceOnly",
				WHEN_UNLOCKED_THIS_DEVICE_ONLY:
					"AccessibleWhenUnlockedThisDeviceOnly",
				AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY:
					"AccessibleAfterFirstUnlockThisDeviceOnly",
				ALWAYS_THIS_DEVICE_ONLY: "AccessibleAlwaysThisDeviceOnly"
			}
		})
	}
})
