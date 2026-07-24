export type ChecklistStatus =
  | "unconfirmed"
  | "in_progress"
  | "confirmed"
  | "not_applicable";

export type ChecklistEntry = {
  id: string;
  category: string;
  label: string;
  status: ChecklistStatus;
  reviewer: string;
  reviewedAt: string;
  note: string;
};

export type ChecklistState = {
  version: 1;
  updatedAt: string;
  entries: ChecklistEntry[];
};

export const checklistStorageKey = "docs-requirements-checklist:v1";

export const checklistStatusLabels: Record<ChecklistStatus, string> = {
  unconfirmed: "未確認",
  in_progress: "確認中",
  confirmed: "確認済",
  not_applicable: "対象外",
};

const checklistDefinitions = [
  ["scope-01", "目的・範囲", "解決する業務課題と期待効果が合意されている"],
  ["scope-02", "目的・範囲", "対象範囲と対象外範囲が明記されている"],
  ["scope-03", "目的・範囲", "前提条件と制約に責任者がいる"],
  ["function-01", "機能・データ", "各機能に利用者と受入条件がある"],
  ["function-02", "機能・データ", "主要データの作成・更新・削除権限が明確である"],
  ["function-03", "機能・データ", "例外処理とエラー時の運用が定義されている"],
  ["nfr-01", "非機能・運用", "性能値と測定条件が具体的である"],
  ["nfr-02", "非機能・運用", "可用性、バックアップ、復旧目標が確認済みである"],
  ["nfr-03", "非機能・運用", "ログ、監査、保守、問い合わせ体制が整理されている"],
  ["integration-01", "連携・移行", "外部システムの責任分界点が明確である"],
  ["integration-02", "連携・移行", "連携頻度、形式、失敗時の再処理が定義されている"],
  ["integration-03", "連携・移行", "移行対象、品質確認、切戻し方法がある"],
  ["review-01", "レビュー・合意", "未決事項に期限と責任者が設定されている"],
  ["review-02", "レビュー・合意", "業務・開発・運用・セキュリティがレビューした"],
  ["review-03", "レビュー・合意", "承認版と変更管理方法が共有されている"],
] as const;

export function createEmptyChecklistState(): ChecklistState {
  return {
    version: 1,
    updatedAt: new Date(0).toISOString(),
    entries: checklistDefinitions.map(([id, category, label]) => ({
      id,
      category,
      label,
      status: "unconfirmed",
      reviewer: "",
      reviewedAt: "",
      note: "",
    })),
  };
}

export function parseChecklistState(raw: string | null): ChecklistState {
  if (!raw) return createEmptyChecklistState();
  try {
    const parsed = JSON.parse(raw) as Partial<ChecklistState>;
    if (parsed.version !== 1 || !Array.isArray(parsed.entries)) {
      return createEmptyChecklistState();
    }
    const byId = new Map(parsed.entries.map((entry) => [entry.id, entry]));
    const empty = createEmptyChecklistState();
    return {
      version: 1,
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : empty.updatedAt,
      entries: empty.entries.map((entry) => {
        const stored = byId.get(entry.id);
        if (!stored || !isChecklistStatus(stored.status)) return entry;
        return {
          ...entry,
          status: stored.status,
          reviewer: safeText(stored.reviewer),
          reviewedAt: safeText(stored.reviewedAt),
          note: safeText(stored.note),
        };
      }),
    };
  } catch {
    return createEmptyChecklistState();
  }
}

export function checklistSummary(state: ChecklistState) {
  const total = state.entries.length;
  const notApplicable = state.entries.filter(
    (entry) => entry.status === "not_applicable",
  ).length;
  const confirmed = state.entries.filter(
    (entry) => entry.status === "confirmed",
  ).length;
  const pending = state.entries.filter(
    (entry) =>
      entry.status === "unconfirmed" || entry.status === "in_progress",
  ).length;
  const applicable = total - notApplicable;
  return {
    total,
    confirmed,
    pending,
    notApplicable,
    completionRate:
      applicable === 0 ? 100 : Math.round((confirmed / applicable) * 100),
  };
}

export function checklistAsText(state: ChecklistState) {
  const summary = checklistSummary(state);
  const rows = state.entries.map(
    (entry) =>
      `[${checklistStatusLabels[entry.status]}] ${entry.category}｜${entry.label}` +
      `${entry.reviewer ? `｜確認者: ${entry.reviewer}` : ""}` +
      `${entry.reviewedAt ? `｜確認日: ${entry.reviewedAt}` : ""}` +
      `${entry.note ? `｜備考: ${entry.note}` : ""}`,
  );
  return [
    "要件定義レビュー・チェックリスト",
    `確認済 ${summary.confirmed}/${summary.total}｜未確認 ${summary.pending}｜対象外 ${summary.notApplicable}｜完了率 ${summary.completionRate}%`,
    "",
    ...rows,
  ].join("\n");
}

function isChecklistStatus(value: unknown): value is ChecklistStatus {
  return (
    value === "unconfirmed" ||
    value === "in_progress" ||
    value === "confirmed" ||
    value === "not_applicable"
  );
}

function safeText(value: unknown) {
  return typeof value === "string" ? value.slice(0, 500) : "";
}
