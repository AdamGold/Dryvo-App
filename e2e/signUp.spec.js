describe("SignUp error", () => {
	beforeEach(async () => {
		await device.reloadReactNative()
	})

	it("should have login form", async () => {
		await expect(element(by.id("emailInput"))).toBeVisible()
		await expect(element(by.id("passwordInput"))).toBeVisible()
		await expect(element(by.id("signInButton"))).toBeVisible()
		await expect(element(by.id("facebookLogin"))).toBeVisible()
	})

	it("should error in sign up", async () => {
		await element(by.id("signUpButton")).tap()
		await waitFor(element(by.id("facebookLogin"))).toBeNotVisible()
		await waitFor(element(by.id("rnameInput"))).toBeVisible()
		await element(by.id("remailInput")).typeText("T@t.com")
		await element(by.id("rnameInput")).typeText("test")
		await element(by.id("rareaInput")).typeText("test")
		await element(by.id("rpasswordInput")).typeText("1234567")
		await element(by.id("rsignUpButton")).tap()
		await expect(element(by.id("rerror"))).toHaveText(
			"Email is already registered."
		)
	})
})
