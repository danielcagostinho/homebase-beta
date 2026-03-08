import { test, expect } from "@playwright/test";
import { login, TEST_USER } from "./helpers";

test.describe("Auth", () => {
  test("can log in with valid credentials", async ({ page }) => {
    await login(page);
    await expect(page.getByText("Here's the Rundown")).toBeVisible();
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(TEST_USER.email);
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page.getByText("Invalid email or password")).toBeVisible();
  });

  test("can log out", async ({ page }) => {
    await login(page);
    await page.getByRole("button", { name: "Log out" }).click();
    await page.waitForURL("/login");
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("/login");
  });

  test("redirects authenticated users away from login", async ({ page }) => {
    await login(page);
    await page.goto("/login");
    await page.waitForURL("/dashboard");
  });

  test("can register a new account", async ({ page }) => {
    const unique = Date.now();
    await page.goto("/register");
    await page.getByLabel("Name").fill("E2E Tester");
    await page.getByLabel("Email").fill(`e2e-${unique}@homebase.dev`);
    await page.getByLabel("Password", { exact: true }).fill("password123");
    await page.getByLabel("Confirm password").fill("password123");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForURL("/dashboard");
    await expect(page.getByText("Here's the Rundown")).toBeVisible();
  });

  test("shows error for mismatched passwords", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Name").fill("Test");
    await page.getByLabel("Email").fill("mismatch@example.com");
    await page.getByLabel("Password", { exact: true }).fill("password123");
    await page.getByLabel("Confirm password").fill("different");
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByText("Passwords don't match")).toBeVisible();
  });
});
