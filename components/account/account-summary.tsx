import type { AccountUsageResponse } from "@/lib/types";
import { formatCount } from "@/lib/format-number";
import type { ReactNode } from "react";

export function AccountSummary({
  usage,
}: {
  usage: AccountUsageResponse | null;
}) {
  const summary = usage?.summary;
  const business = summary?.businessPack;
  const nextExpiringDocument = summary?.nextExpiringDocument;
  const single = summary?.singleDocumentPack;
  const businessCards: [string, ReactNode][] = summary?.hasBusinessPack
    ? [
        ["利用形態", "Business Pack"],
        [
          "利用状況",
          <span key="business-usage" className="flex items-baseline gap-3">
            <span>
              {business ? formatCount(business.unstartedDocumentCredits) : "-"}
            </span>
            <span className="text-sm font-semibold text-slate-500">
              残り / 生成済み {formatCount(business?.startedDocumentCount)}
            </span>
          </span>,
        ],
        ["有効期限", formatDate(business?.expiresAt)],
      ]
    : [];
  const singleCards: [string, ReactNode][] = single
    ? [
        ["利用形態", "Docs Single"],
        ["購入済み文書数", formatCount(single.purchasedDocumentCount)],
        [
          "次に失効する文書",
          single.nextExpiringDocument
            ? `${single.nextExpiringDocument.documentTitle}：${formatDate(
                single.nextExpiringDocument.expiresAt,
              )}`
            : "未設定",
        ],
      ]
    : summary?.hasBusinessPack
      ? []
      : [
          [
            "利用形態",
            summary?.planType === "ONESHOT"
              ? "Docs Single"
              : (summary?.planType ?? "-"),
          ],
          ["利用中の文書数", formatCount(usage?.documents.length)],
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
    <div className="mt-6 space-y-4">
      {businessCards.length ? (
        <SummarySection cards={businessCards} columns="md:grid-cols-3" />
      ) : null}
      {singleCards.length ? (
        <SummarySection cards={singleCards} columns="md:grid-cols-3" />
      ) : null}
    </div>
  );
}

function SummarySection({
  cards,
  columns,
}: {
  cards: [string, ReactNode][];
  columns: string;
}) {
  return (
    <div className={`grid gap-4 ${columns}`}>
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
