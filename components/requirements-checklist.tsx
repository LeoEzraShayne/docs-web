"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { trackAnalyticsEvent } from "@/lib/analytics";
import {
  checklistAsText,
  checklistStatusLabels,
  checklistStorageKey,
  checklistSummary,
  createEmptyChecklistState,
  parseChecklistState,
  type ChecklistEntry,
  type ChecklistState,
  type ChecklistStatus,
} from "@/lib/requirements-checklist";

const storageEvent = "docs-requirements-checklist-change";
let memorySnapshot = "";
const inputClassName = "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-amber-400";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(storageEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(storageEvent, callback);
  };
}

function getSnapshot() {
  try {
    const stored = window.localStorage.getItem(checklistStorageKey);
    if (stored !== null) memorySnapshot = stored;
    return stored ?? memorySnapshot;
  } catch {
    return memorySnapshot;
  }
}

export function RequirementsChecklist() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => "");
  const state = useMemo(() => parseChecklistState(raw), [raw]);
  const summary = checklistSummary(state);
  const [message, setMessage] = useState("");
  const [exporting, setExporting] = useState(false);
  const categories = [...new Set(state.entries.map((entry) => entry.category))];

  function persist(next: ChecklistState) {
    memorySnapshot = JSON.stringify(next);
    try {
      window.localStorage.setItem(checklistStorageKey, memorySnapshot);
      setMessage("このブラウザに保存しました。");
    } catch {
      setMessage("ブラウザに保存できませんでした。入力中はこの画面で利用できます。");
    }
    window.dispatchEvent(new Event(storageEvent));
  }

  function update(id: string, patch: Partial<ChecklistEntry>) {
    persist({
      version: 1,
      updatedAt: new Date().toISOString(),
      entries: state.entries.map((entry) =>
        entry.id === id ? { ...entry, ...patch } : entry,
      ),
    });
  }

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(checklistAsText(state));
      trackAnalyticsEvent("checklist_copy", {
        pagePath: "/requirements-definition-checklist",
        ctaPosition: "checklist-actions",
      });
      setMessage("チェック結果をコピーしました。");
    } catch {
      setMessage("コピーできませんでした。ブラウザの権限を確認してください。");
    }
  }

  async function exportExcel() {
    setExporting(true);
    setMessage("");
    try {
      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("レビュー・チェックリスト", {
        views: [{ state: "frozen", ySplit: 4, showGridLines: false }],
      });
      sheet.mergeCells("A1:F1");
      sheet.getCell("A1").value = "要件定義レビュー・チェックリスト";
      sheet.getCell("A1").font = { bold: true, color: { argb: "FFFFFFFF" }, size: 16 };
      sheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F172A" } };
      sheet.getCell("A2").value = `確認済 ${summary.confirmed}/${summary.total}｜未確認 ${summary.pending}｜対象外 ${summary.notApplicable}｜完了率 ${summary.completionRate}%`;
      sheet.mergeCells("A2:F2");
      sheet.addRow([]);
      sheet.addRow(["分類", "チェック項目", "状態", "確認者", "確認日", "備考"]);
      state.entries.forEach((entry) =>
        sheet.addRow([
          entry.category,
          entry.label,
          checklistStatusLabels[entry.status],
          entry.reviewer,
          entry.reviewedAt,
          entry.note,
        ]),
      );
      const header = sheet.getRow(4);
      header.font = { bold: true, color: { argb: "FF0F172A" } };
      header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF59E0B" } };
      sheet.columns = [18, 52, 14, 18, 14, 36].map((width) => ({ width }));
      sheet.eachRow((row, rowNumber) => {
        row.alignment = { vertical: "top", wrapText: true };
        if (rowNumber >= 4) {
          row.eachCell((cell) => {
            cell.border = {
              top: { style: "thin", color: { argb: "FFCBD5E1" } },
              left: { style: "thin", color: { argb: "FFCBD5E1" } },
              bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
              right: { style: "thin", color: { argb: "FFCBD5E1" } },
            };
          });
        }
      });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([new Uint8Array(buffer)], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "requirements-definition-checklist-ja.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      trackAnalyticsEvent("checklist_export", {
        pagePath: "/requirements-definition-checklist",
        ctaPosition: "checklist-actions",
        assetName: "requirements-definition-checklist-ja.xlsx",
      });
      setMessage("チェック結果をExcelで出力しました。");
    } catch {
      setMessage("Excelを出力できませんでした。時間をおいて再度お試しください。");
    } finally {
      setExporting(false);
    }
  }

  function reset() {
    if (!window.confirm("入力したチェック結果をすべて削除しますか？")) return;
    memorySnapshot = "";
    try {
      window.localStorage.removeItem(checklistStorageKey);
      window.dispatchEvent(new Event(storageEvent));
    } catch {
      persist(createEmptyChecklistState());
    }
    setMessage("チェック結果をリセットしました。");
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="チェック進捗">
        {[
          ["全項目", summary.total],
          ["確認済", summary.confirmed],
          ["未確認", summary.pending],
          ["完了率", `${summary.completionRate}%`],
        ].map(([label, value]) => (
          <Card key={label} className="rounded-xl p-4">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-50">{value}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => void copyResult()}>結果をコピー</Button>
        <Button variant="secondary" disabled={exporting} onClick={() => void exportExcel()}>
          {exporting ? "Excelを作成中..." : "Excelで出力"}
        </Button>
        <a
          className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100"
          href="/requirements-definition-template-ja.xlsx"
          download="requirements-definition-template-ja.xlsx"
          onClick={() =>
            trackAnalyticsEvent("template_download", {
              pagePath: "/requirements-definition-checklist",
              ctaPosition: "checklist-actions",
              assetName: "requirements-definition-template-ja.xlsx",
            })
          }
        >
          無料テンプレート
        </a>
        <Button variant="ghost" onClick={reset}>すべてリセット</Button>
      </div>
      <p className="text-sm text-amber-200" role="status">{message}</p>
      <p className="text-sm leading-7 text-slate-400">
        入力内容はこのブラウザのみに保存され、サーバーへ送信されません。別の端末やブラウザには同期されません。
      </p>

      {categories.map((category) => (
        <Card key={category} className="rounded-2xl p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-50">{category}</h2>
            <p className="text-xs text-slate-500">
              確認済 {state.entries.filter((entry) => entry.category === category && entry.status === "confirmed").length} / {state.entries.filter((entry) => entry.category === category && entry.status !== "not_applicable").length}
            </p>
          </div>
          <div className="mt-5 space-y-5">
            {state.entries
              .filter((entry) => entry.category === category)
              .map((entry) => (
                <fieldset key={entry.id} className="rounded-xl border border-slate-800 p-4">
                  <legend className="px-2 text-sm font-medium leading-7 text-slate-200">{entry.label}</legend>
                  <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Field label="状態">
                      <select
                        aria-label={`${entry.label}の状態`}
                        className={inputClassName}
                        value={entry.status}
                        onChange={(event) => update(entry.id, { status: event.target.value as ChecklistStatus })}
                      >
                        {Object.entries(checklistStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </Field>
                    <Field label="確認者">
                      <input aria-label={`${entry.label}の確認者`} className={inputClassName} value={entry.reviewer} maxLength={100} onChange={(event) => update(entry.id, { reviewer: event.target.value })} />
                    </Field>
                    <Field label="確認日">
                      <input aria-label={`${entry.label}の確認日`} className={inputClassName} type="date" value={entry.reviewedAt} onChange={(event) => update(entry.id, { reviewedAt: event.target.value })} />
                    </Field>
                    <Field label="備考">
                      <input aria-label={`${entry.label}の備考`} className={inputClassName} value={entry.note} maxLength={500} onChange={(event) => update(entry.id, { note: event.target.value })} />
                    </Field>
                  </div>
                </fieldset>
              ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-xs text-slate-500"><span className="mb-2 block">{label}</span>{children}</label>;
}
