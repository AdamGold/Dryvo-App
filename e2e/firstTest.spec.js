describe("Example", () => {
	beforeEach(async () => {
		await device.reloadReactNative()
	})

	it("should have login form", async () => {
		await expect(element(by.id("emailInput"))).toBeVisible()
		await expect(element(by.id("passwordInput"))).toBeVisible()
		await expect(element(by.id("signInButton"))).toBeVisible()
	})
})
