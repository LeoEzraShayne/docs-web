import { expect, test, type Page } from "@playwright/test";

const API = "http://localhost:3002";

async function mockAuth(page: Page) {
  await page.route(`${API}/auth/me`, (route) =>
    route.fulfill({
      json: { user: { id: "user-1", email: "test@example.com" } },
    }),
  );
  await page.route(`${API}/billing/me`, (route) =>
    route.fulfill({
      json: { planType: "ONESHOT", remaining: 0, periodEnd: null },
    }),
  );
}

test("shows current Docs pricing", async ({ page }) => {
  await mockAuth(page);
  await page.goto("/pricing");

  await expect(page.getByText("Docs Single", { exact: true })).toBeVisible();
  await expect(page.getByText("¥980")).toBeVisible();
  await expect(page.getByText("Business Pack", { exact: true })).toBeVisible();
  await expect(page.getByText("¥66,640")).toBeVisible();
  await expect(page.getByText("Starter")).toHaveCount(0);
  await expect(page.getByText("Pro")).toHaveCount(0);
});

test("routes each paid plan to its checkout API", async ({ page }) => {
  await mockAuth(page);
  const requests: string[] = [];
  await page.route(`${API}/billing/checkout/single-document`, (route) => {
    requests.push("single");
    route.fulfill({ json: { url: "http://localhost:3100/success" } });
  });
  await page.route(`${API}/billing/checkout/business-pack`, (route) => {
    requests.push("business");
    route.fulfill({ json: { url: "http://localhost:3100/success" } });
  });

  await page.goto("/pricing");
  await page.getByRole("button", { name: "購入する" }).first().click();
  await expect.poll(() => requests).toContainEqual("single");
  await page.waitForURL("**/success");
  await page.goto("/pricing");
  await page.getByRole("button", { name: "購入する" }).nth(1).click();
  await expect.poll(() => requests).toContainEqual("business");
});
