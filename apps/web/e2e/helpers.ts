import type { Page } from "@playwright/test";

export const TEST_USER = {
  email: "test@homebase.dev",
  password: "password123",
};

export async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(TEST_USER.email);
  await page.getByLabel("Password").fill(TEST_USER.password);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL("/dashboard");
}
