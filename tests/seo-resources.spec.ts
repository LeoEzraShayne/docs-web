import { expect, test } from "@playwright/test";
import ExcelJS from "exceljs";
import catalog from "../lib/generated/document-catalog.v1.json";

const requirementsSheets = catalog.documents.REQUIREMENTS.sheets;

const resources = [
  {
    path: "/requirements-definition-sample",
    title: "要件定義書サンプル｜Webシステムの記入例を項目別に解説",
  },
  {
    path: "/requirements-definition-tools",
    title: "要件定義ツールの選び方｜Excel・文書ツール・生成AIを比較",
  },
  {
    path: "/requirements-definition-how-to-write",
    title: "要件定義書の書き方｜ヒアリングからレビュー・合意までの手順",
  },
  {
    path: "/requirements-definition-checklist",
    title: "要件定義チェックリスト｜レビュー前に確認する項目",
  },
];

for (const resource of resources) {
  test(`${resource.path} has unique SEO metadata and conversion links`, async ({
    page,
  }) => {
    await page.goto(resource.path);

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      resource.title,
    );
    await expect(page).toHaveTitle(new RegExp(resource.title));
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://docs.meritledger.org${resource.path}`,
    );
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(
      3,
    );
    await expect(page.getByRole("link", { name: "無料デモを試す" })).not.toHaveCount(0);
    await expect(page.getByRole("link", { name: "AIで文書を作成する" })).not.toHaveCount(0);
    await expect(page.getByRole("link", { name: "料金を見る" })).toHaveCount(1);

    const relatedLinks = page.locator(
      'a[href^="/requirements-definition"], a[href="/meeting-notes-to-requirements-definition"]',
    );
    await expect(relatedLinks).not.toHaveCount(0);
  });
}

test("sitemap exposes resources but not protected routes", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBeTruthy();
  const xml = await response.text();

  for (const resource of resources) {
    expect(xml).toContain(`https://docs.meritledger.org${resource.path}`);
  }
  expect(xml).not.toContain("https://docs.meritledger.org/app");
  expect(xml).not.toContain("https://docs.meritledger.org/account");
  expect(xml).not.toContain("https://docs.meritledger.org/success");
});

test("legacy template guide permanently redirects", async ({ request }) => {
  const response = await request.get("/blog/requirements-definition-template", {
    maxRedirects: 0,
  });
  expect(response.status()).toBe(301);
  expect(response.headers().location).toBe("/requirements-definition-template");
});

test("Excel template downloads without authentication", async ({ request }) => {
  const response = await request.get("/requirements-definition-template-ja.xlsx");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain(
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  const bytes = await response.body();
  expect(bytes.subarray(0, 2).toString()).toBe("PK");
  expect(bytes.byteLength).toBeGreaterThan(10_000);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(bytes);
  const expected = [
    ...requirementsSheets.map(
      (sheet) => [sheet.workbookName, sheet.columns] as const,
    ),
    ["レビュー・チェックリスト", ["分類", "チェック項目", "状態", "確認者", "確認日", "備考"]],
    ["記入例", ["分類", "項目", "記入例", "受入・確認条件", "状態", "備考"]],
  ] as const;
  expect(workbook.worksheets.map((sheet) => sheet.name)).toEqual(expected.map(([name]) => name));
  for (const [name, headers] of expected) {
    expect(headers.map((_, index) => workbook.getWorksheet(name)?.getRow(4).getCell(index + 1).text)).toEqual(headers);
  }
  expect(workbook.getWorksheet("レビュー・チェックリスト")?.getCell("C5").dataValidation.type).toBe("list");
});

test("formal requirements sample Excel matches the 12-sheet product contract", async ({
  request,
  page,
}) => {
  const response = await request.get("/requirements-definition-sample-ja.xlsx");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain(
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await response.body());
  const expectedNames = requirementsSheets.map((sheet) => sheet.workbookName);
  expect(workbook.worksheets.map((sheet) => sheet.name)).toEqual(expectedNames);
  expect(workbook.worksheets.every((sheet) => sheet.rowCount >= 5)).toBe(true);

  await page.goto("/requirements-definition-sample");
  await expect(
    page.getByRole("link", { name: "サンプルExcelを無料ダウンロード" }),
  ).toHaveAttribute("href", "/requirements-definition-sample-ja.xlsx");
  for (const name of expectedNames) {
    await expect(page.getByRole("heading", { name: new RegExp(name) })).toBeVisible();
  }
});

test("all five AI landing pages expose the real product sheet contract", async ({
  page,
}) => {
  const pages = [
    ["/requirements-definition-ai", 12, "外部連携・API一覧"],
    ["/basic-design-ai", 10, "バッチ・帳票設計"],
    ["/detailed-design-ai", 9, "メッセージ設計"],
    ["/unit-test-spec-ai", 3, "DBテスト"],
    ["/integration-test-spec-ai", 1, "業務シナリオテスト"],
  ] as const;

  for (const [path, sheetCount, finalSheet] of pages) {
    await page.goto(path);
    await expect(
      page.getByRole("heading", {
        name: `製品が生成する正式${sheetCount}シート`,
      }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: new RegExp(finalSheet) })).toBeVisible();
    await expect(page.getByText("Product document contract v1")).toBeVisible();
  }

  await page.goto("/requirements-definition-ai");
  await expect(page.getByText("用語集")).toHaveCount(0);
});

test("meeting notes page maps raw information to real target sheets and columns", async ({
  page,
}) => {
  await page.goto("/meeting-notes-to-requirements-definition");
  await expect(page.getByRole("columnheader", { name: "会議メモの原始情報" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "対象シート" })).toBeVisible();
  await expect(page.getByText("外部連携・API一覧", { exact: true })).toBeVisible();
  await expect(page.getByText("API名 / 目的 / 呼出元 / 呼出先 / 業務説明")).toBeVisible();
});

test("interactive checklist persists, copies, exports, and resets locally", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/requirements-definition-checklist");

  const firstLabel = "解決する業務課題と期待効果が合意されている";
  const secondLabel = "対象範囲と対象外範囲が明記されている";
  await page.getByLabel(`${firstLabel}の状態`).selectOption("confirmed");
  await page.getByLabel(`${firstLabel}の確認者`).fill("山田太郎");
  await page.getByLabel(`${firstLabel}の確認日`).fill("2026-07-24");
  await page.getByLabel(`${firstLabel}の備考`).fill("業務責任者と確認済み");
  await page.getByLabel(`${secondLabel}の状態`).selectOption("not_applicable");

  const progress = page.getByLabel("チェック進捗");
  await expect(progress).toContainText("確認済1");
  await expect(progress).toContainText("未確認13");
  await expect(progress).toContainText("完了率7%");

  await page.reload();
  await expect(page.getByLabel(`${firstLabel}の確認者`)).toHaveValue("山田太郎");
  await page.getByRole("button", { name: "結果をコピー" }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("山田太郎");
  expect(copied).toContain("業務責任者と確認済み");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Excelで出力" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("requirements-definition-checklist-ja.xlsx");
  const path = await download.path();
  expect(path).toBeTruthy();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path!);
  const sheet = workbook.getWorksheet("レビュー・チェックリスト");
  expect(sheet?.getRow(4).values.slice(1)).toEqual(["分類", "チェック項目", "状態", "確認者", "確認日", "備考"]);
  expect(sheet?.getCell("D5").value).toBe("山田太郎");

  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "すべてリセット" }).click();
  await expect(page.getByLabel(`${firstLabel}の確認者`)).toHaveValue("山田太郎");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "すべてリセット" }).click();
  await expect(page.getByLabel(`${firstLabel}の確認者`)).toHaveValue("");
});

test("damaged checklist storage falls back to blank state", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("docs-requirements-checklist:v1", "not-json"));
  await page.goto("/requirements-definition-checklist");
  await expect(page.getByLabel("チェック進捗")).toContainText("未確認15");
});

test("cookie settings supports consent, rejection, and revocation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Cookie設定" }).click();
  const settings = page.getByRole("dialog", { name: "Cookie設定" });
  await expect(settings).toContainText("未選択");
  await settings.getByRole("button", { name: "同意する" }).click();
  await expect(settings).toContainText("同意済み");
  await settings.getByRole("button", { name: "同意を撤回" }).click();
  await expect(settings).toContainText("拒否済み");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("docs-analytics-consent"))).toBe("declined");
});

test("analytics emits once only after consent", async ({ page }) => {
  test.skip(!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, "GA4 Measurement ID is required for event emission");
  await page.addInitScript(() => {
    localStorage.setItem("docs-analytics-consent", "accepted");
    (window as typeof window & { capturedEvents: unknown[][] }).capturedEvents = [];
    window.gtag = (...args: unknown[]) => (window as typeof window & { capturedEvents: unknown[][] }).capturedEvents.push(args);
  });
  await page.goto("/");
  await page.getByRole("link", { name: "デモで試す" }).click();
  await expect(page).toHaveURL(/\/demo$/);
  const events = await page.evaluate(() => [
    ...(window as typeof window & { capturedEvents: unknown[][] }).capturedEvents,
    ...((window.dataLayer ?? []).map((event) => Array.from(event as ArrayLike<unknown>))),
  ]);
  expect(events.filter((event) => event[0] === "event" && event[1] === "seo_demo_click")).toHaveLength(1);
});

test("sample download emits its dedicated analytics event once", async ({
  page,
}) => {
  test.skip(
    !process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    "GA4 Measurement ID is required for event emission",
  );
  await page.addInitScript(() => {
    localStorage.setItem("docs-analytics-consent", "accepted");
    (window as typeof window & { capturedEvents: unknown[][] }).capturedEvents = [];
    window.gtag = (...args: unknown[]) =>
      (window as typeof window & { capturedEvents: unknown[][] }).capturedEvents.push(args);
  });
  await page.goto("/requirements-definition-sample");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "サンプルExcelを無料ダウンロード" }).click();
  await downloadPromise;
  const events = await page.evaluate(() => [
    ...(window as typeof window & { capturedEvents: unknown[][] }).capturedEvents,
    ...((window.dataLayer ?? []).map((event) =>
      Array.from(event as ArrayLike<unknown>),
    )),
  ]);
  expect(
    events.filter(
      (event) => event[0] === "event" && event[1] === "sample_download",
    ),
  ).toHaveLength(1);
});

test("analytics is a no-op after rejection", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("docs-analytics-consent", "declined");
    (window as typeof window & { capturedEvents: unknown[][] }).capturedEvents = [];
    window.gtag = (...args: unknown[]) => (window as typeof window & { capturedEvents: unknown[][] }).capturedEvents.push(args);
  });
  await page.goto("/");
  await page.getByRole("link", { name: "デモで試す" }).click();
  const events = await page.evaluate(() => (window as typeof window & { capturedEvents: unknown[][] }).capturedEvents);
  expect(events).toHaveLength(0);
});

test("tools page states that multiplayer collaboration is unsupported", async ({ page }) => {
  await page.goto("/requirements-definition-tools");
  await expect(page.getByText(/リアルタイム共同編集、コメント、承認ワークフローは現在提供していません/)).toBeVisible();
});

test("analytics respects configuration and explicit consent", async ({
  page,
}) => {
  await page.goto("/requirements-definition-template");
  const dialog = page.getByRole("dialog", {
    name: "アクセス解析Cookieの確認",
  });

  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    await expect(dialog).toHaveCount(0);
    await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);
    return;
  }

  await expect(dialog).toBeVisible();
  await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);
  await dialog.getByRole("button", { name: "同意する" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(1);
});
