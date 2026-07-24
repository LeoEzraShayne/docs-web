import { expect, test, type Page } from "@playwright/test";

const API = "http://localhost:3002";

async function mockWorkspace(page: Page) {
  await page.route(`${API}/auth/me`, (route) =>
    route.fulfill({ json: { user: { id: "user-1", email: "test@example.com" } } }),
  );
  await page.route(`${API}/projects?page=1&pageSize=12`, (route) =>
    route.fulfill({
      json: {
        items: [{ id: "project-1", docTitle: "互換案件", updatedAt: "2026-07-24", status: "READY" }],
        page: 1,
        pageSize: 12,
        total: 1,
        totalPages: 1,
      },
    }),
  );
  await page.route(`${API}/projects/project-1/documents/tree`, (route) =>
    route.fulfill({ json: [] }),
  );
}

test("public demo renders the formal 12-sheet preview", async ({ page }) => {
  await page.route(`${API}/demo/preview`, (route) =>
    route.fulfill({
      json: {
        schema: "requirements-v2",
        project: { id: "demo", docTitle: "Demo Project" },
        versionNo: 1,
        tabs: officialTabs(),
        paywall: { canExport: false, remaining: 0 },
      },
    }),
  );
  await page.goto("/demo");
  await expect(page.getByText("正式な要件定義書12シートを表示しています")).toBeVisible();
  await expect(page.getByRole("button", { name: "項目概要" })).toBeVisible();
  await page.getByRole("button", { name: "機能要件一覧" }).click();
  await expect(page.getByText("（正式生成後に表示）")).toBeVisible();
});

test("saved six-tab versions remain readable and are marked as legacy", async ({
  page,
}) => {
  await mockWorkspace(page);
  await page.route(`${API}/projects/project-1/versions/1`, (route) =>
    route.fulfill({
      json: {
        schema: "legacy-v1",
        project: { id: "project-1", docTitle: "旧案件" },
        versionNo: 1,
        quality: "standard",
        tabs: {
          flow: [{ step: 1, actor: "営業担当", action: "受注登録" }],
          screens: [],
          functions: [],
          nfr: [],
          risks_issues: [],
          glossary: [],
        },
      },
    }),
  );

  await page.goto("/app/projects/project-1/preview?ver=1");
  await expect(page.getByText(/旧形式バージョンです/)).toBeVisible();
  await expect(page.getByRole("button", { name: "FLOW" })).toBeVisible();
  await expect(page.getByText("営業担当")).toBeVisible();
});

test("new saved versions use Japanese formal sheet tabs", async ({ page }) => {
  await mockWorkspace(page);
  await page.route(`${API}/projects/project-1/versions/2`, (route) =>
    route.fulfill({
      json: {
        schema: "requirements-v2",
        project: { id: "project-1", docTitle: "新案件" },
        versionNo: 2,
        quality: "standard",
        tabs: officialTabs(),
      },
    }),
  );

  await page.goto("/app/projects/project-1/preview?ver=2");
  await expect(page.getByText(/正式な要件定義書12シートのプレビュー/)).toBeVisible();
  await expect(page.getByRole("button", { name: "課題・リスク一覧" })).toBeVisible();
  await expect(page.getByRole("button", { name: "FLOW" })).toHaveCount(0);
});

function officialTabs() {
  return {
    項目概要: [{ No: 1, 項目: "目的", 内容: "受注管理" }],
    スコープ定義: [{ No: 1, 区分: "対象", 対象: "受注", 説明: "登録" }],
    業務要件: [{ No: 1, 業務: "受注", 課題: "分散", 要件: "一元化" }],
    機能要件一覧: [{ No: 1, 機能名: "検索", 目的: "確認", 概要: "（正式生成後に表示）", 優先度: "高" }],
    画面一覧: [],
    画面概要: [],
    権限一覧: [],
    データ項目定義: [],
    "外部連携/API一覧": [],
    非機能要件: [],
    業務フロー: [],
    "課題・リスク一覧": [],
  };
}
