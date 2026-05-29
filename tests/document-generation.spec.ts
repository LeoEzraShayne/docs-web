import { expect, test, type Page } from "@playwright/test";

const API = "http://localhost:3002";

const documents = [
  node("REQUIREMENTS", "要件定義書", "req-v1"),
  node("BASIC_DESIGN", "基本設計書", "basic-v1"),
  node("DETAILED_DESIGN", "詳細設計書", "detail-v1"),
  node("UNIT_TEST", "単体テスト仕様書"),
  node("INTEGRATION_TEST", "結合テスト仕様書"),
];

function node(type: string, title: string, versionId?: string) {
  return {
    id: `${type.toLowerCase()}-doc`,
    type,
    title,
    currentVersion: versionId ? 1 : 0,
    grant: { remainingGenerations: 2, expiresAt: "2026-06-06T00:00:00.000Z" },
    versions: versionId
      ? [{ id: versionId, versionNo: 1, createdAt: "2026-05-30T00:00:00.000Z" }]
      : [],
  };
}

async function mockApi(page: Page) {
  await page.route(`${API}/auth/me`, (route) =>
    route.fulfill({
      json: { user: { id: "user-1", email: "test@example.com" } },
    }),
  );
  await page.route(`${API}/billing/me`, (route) =>
    route.fulfill({
      json: { planType: "ONESHOT", remaining: 10, periodEnd: null },
    }),
  );
  await page.route(`${API}/projects/project-1`, (route) =>
    route.fulfill({
      json: {
        id: "project-1",
        docTitle: "テスト案件",
        minutesText: "",
        formFields: {},
        versions: [],
      },
    }),
  );
  await page.route(`${API}/projects/project-1/documents/tree`, (route) =>
    route.fulfill({ json: documents }),
  );
  await page.route(`${API}/projects/project-1/documents/**/generate`, (route) =>
    route.fulfill({
      json: {
        id: "new-version",
        versionNo: 2,
        createdAt: "2026-05-30T00:00:00.000Z",
        tabs: {},
        document: documents[0],
        downloadUrl: "/download",
        grant: {
          remainingGenerations: 1,
          expiresAt: "2026-06-06T00:00:00.000Z",
        },
      },
    }),
  );
  await page.route(`${API}/projects/project-1/documents/**/download`, (route) =>
    route.fulfill({
      body: "xlsx",
      headers: {
        "content-type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    }),
  );
  await page.route(`${API}/billing/checkout/single-document`, (route) =>
    route.fulfill({ json: { url: "http://localhost:3100/pricing" } }),
  );
}

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test("opens all five document pages", async ({ page }) => {
  const routes = [
    ["requirements", "要件定義書"],
    ["basic-design", "基本設計書"],
    ["detailed-design", "詳細設計書"],
    ["unit-test", "単体テスト仕様書"],
    ["integration-test", "結合テスト仕様書"],
  ];

  for (const [route, title] of routes) {
    await page.goto(`/app/projects/project-1/documents/${route}`);
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
    await expect(page.getByText("標準版（推奨）")).toBeVisible();
  }
});

test("shows and hides source-specific fields", async ({ page }) => {
  await page.goto("/app/projects/project-1/documents/basic-design");
  await expect(page.getByText("バージョン", { exact: true })).toBeVisible();
  await expect(page.getByText("システム構成要件")).toHaveCount(0);
  await page.getByLabel("入力ソース").selectOption("DIRECT_INPUT");
  await expect(page.getByText("システム構成要件")).toBeVisible();

  await page.goto("/app/projects/project-1/documents/unit-test");
  await expect(page.getByLabel("正常系")).toBeChecked();
  await expect(page.getByText("画面一覧")).toHaveCount(0);
  await page.getByLabel("入力ソース").selectOption("DIRECT_INPUT");
  await expect(page.getByText("画面一覧")).toBeVisible();

  await page.goto("/app/projects/project-1/documents/integration-test");
  await expect(page.getByText("設計資料", { exact: true })).toHaveCount(0);
  await page.getByLabel("入力ソース").selectOption("PASTED_DESIGN");
  await page
    .getByRole("textbox", { name: /設計資料/ })
    .fill("a".repeat(10_001));
  await expect(page.getByText("10000 / 10000")).toBeVisible();
});

test("generates, keeps success state, and refreshes versions", async ({
  page,
}) => {
  await page.goto("/app/projects/project-1/documents/requirements");
  await page.getByLabel("解決したい課題").fill("課題");
  await page.getByLabel("実現したいこと").fill("目標");
  await page.getByLabel("主な機能").fill("機能");
  await page.getByRole("button", { name: "要件定義書を生成する" }).click();

  await expect(
    page.getByText("生成が完了しました。v2 を保存しました。"),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "再ダウンロード" }).first(),
  ).toBeVisible();
});
