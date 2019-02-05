// https://remarkablemark.org/blog/2018/06/28/jest-mock-default-named-export/

jest.mock("rn-secure-storage", () => ({
	__esModule: true, // this property makes it work
	default: {
		get: jest.fn(key => {
			console.log(`get ${key}`)
			return this[key] || null
		}),
		set: jest.fn((key, val) => {
			this[key] = val
			console.log(`set ${key}=${this[key]}`)
			return this[key]
		}),
		remove: jest.fn(key => {
			this[key] = ""
			return true
		})
	},
	ACCESSIBLE: {
		WHEN_UNLOCKED: "AccessibleWhenUnlocked",
		AFTER_FIRST_UNLOCK: "AccessibleAfterFirstUnlock",
		ALWAYS: "AccessibleAlways",
		WHEN_PASSCODE_SET_THIS_DEVICE_ONLY:
			"AccessibleWhenPasscodeSetThisDeviceOnly",
		WHEN_UNLOCKED_THIS_DEVICE_ONLY: "AccessibleWhenUnlockedThisDeviceOnly",
		AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY:
			"AccessibleAfterFirstUnlockThisDeviceOnly",
		ALWAYS_THIS_DEVICE_ONLY: "AccessibleAlwaysThisDeviceOnly"
	}
}))
