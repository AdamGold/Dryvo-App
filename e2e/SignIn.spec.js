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
})
