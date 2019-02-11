describe("Content test", () => {
	it("should login", async () => {
		await expect(element(by.id("emailInput"))).toBeVisible()
		await expect(element(by.id("passwordInput"))).toBeVisible()
		await expect(element(by.id("signInButton"))).toBeVisible()
		await expect(element(by.id("facebookLogin"))).toBeVisible()
		await element(by.id("emailInput")).clearText()
		await element(by.id("emailInput")).typeText("t@t.com")
		await element(by.id("passwordInput")).typeText("testing")
		await element(by.id("signInButton")).tap()
		await waitFor(element(by.id("logoutButton")))
			.toBeVisible()
			.withTimeout(2000)
	})

	it("should have welcome, schedule and amount", async () => {
		await expect(element(by.id("welcomeHeader"))).toBeVisible()
		await expect(element(by.id("schedule"))).toBeVisible()
		await expect(element(by.id("monthlyAmount"))).toBeVisible()
		await expect(element(by.id("NotificationsTab"))).toBeVisible()
		await element(by.id("NotificationsTab")).tap()
	})

	it("should have notifications view", async () => {
		await expect(element(by.id("NotificationsView"))).toBeVisible()
	})
})
