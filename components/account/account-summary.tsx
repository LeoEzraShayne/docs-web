import type { AccountUsageResponse } from "@/lib/types";

export function AccountSummary({ usage }: { usage: AccountUsageResponse | null }) {
  const summary = usage?.summary;
  const business = summary?.businessPack;
  const nextExpiringDocument = summary?.nextExpiringDocument;
  const cards = summary?.hasBusinessPack
    ? [
        ["現在の利用形態", "Business Pack"],
        [
          "未開始文書枠",
          business
            ? `${business.unstartedDocumentCredits} / ${business.totalDocumentCredits}`
            : "-",
        ],
        ["生成済み文書数", String(business?.startedDocumentCount ?? 0)],
        ["有効期限", formatDate(business?.expiresAt)],
      ]
    : [
        [
          "現在の利用形態",
          summary?.planType === "ONESHOT"
            ? "Docs Single"
            : (summary?.planType ?? "-"),
        ],
        ["利用中の文書数", String(usage?.documents.length ?? 0)],
        [
          "次に失効する文書",
          nextExpiringDocument
            ? `${nextExpiringDocument.documentTitle}：${formatDate(
                nextExpiringDocument.expiresAt,
              )}`
            : "未設定",
        ],
      ];

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {cards.map(([label, value]) => (
        <div
          key={label}
          className="rounded-xl border border-slate-800 bg-slate-950/50 p-5"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            {label}
          </p>
          <p className="mt-3 text-2xl font-bold text-slate-100">{value}</p>
        </div>
      ))}
    </div>
  );
}

export function StatusBadge({ status }: { status: "利用中" | "利用不可" }) {
  const active = status === "利用中";
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs ${
        active
          ? "bg-emerald-500/10 text-emerald-200"
          : "bg-orange-500/10 text-orange-200"
      }`}
    >
      {status}
    </span>
  );
}

export function formatDate(value: string | null | undefined) {
  return value ? new Date(value).toLocaleDateString("ja-JP") : "未設定";
}
