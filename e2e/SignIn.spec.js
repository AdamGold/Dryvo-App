describe("Sign In", () => {
	it("should error in login", async () => {
		await expect(element(by.id("emailInput"))).toBeVisible()
		await element(by.id("emailInput")).typeText("huh@h.com")
		await element(by.id("passwordInput")).typeText("testaaaa")
		await element(by.id("signInButton")).tap()
		await expect(element(by.id("error"))).toHaveText(
			"Invalid email or password."
		)
	})

	it("should login", async () => {
		await element(by.id("emailInput")).clearText()
		await element(by.id("emailInput")).typeText("t@t.com")
		await element(by.id("passwordInput")).typeText("testing")
		await element(by.id("signInButton")).tap()
		await waitFor(element(by.id("logoutButton")))
			.toBeVisible()
			.withTimeout(2000)
		await expect(element(by.id("welcomeHeader"))).toBeVisible()
		await expect(element(by.id("emailInput"))).toBeNotVisible()
	})
})
