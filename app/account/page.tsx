"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { AccountSummary } from "@/components/account/account-summary";
import { DocumentUsageTable } from "@/components/account/document-usage-table";
import {
  Pagination,
  purchasePageSizes,
  PurchaseHistoryTable,
} from "@/components/account/purchase-history";
import { api, formatApiError } from "@/lib/api";
import type { AccountUsageResponse, PurchaseHistoryResponse } from "@/lib/types";

export default function AccountPage() {
  const [usage, setUsage] = useState<AccountUsageResponse | null>(null);
  const [history, setHistory] = useState<PurchaseHistoryResponse | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [usageResponse, historyResponse] = await Promise.all([
          api.getAccountUsage(),
          api.getPurchaseHistory(page, pageSize),
        ]);
        setUsage(usageResponse);
        setHistory(historyResponse);
        setMessage(null);
      } catch (err) {
        setMessage(formatApiError(err).message);
      }
    }
    void load();
  }, [page, pageSize]);

  const summary = usage?.summary;

  return (
    <AuthGate>
      <div className="space-y-6 py-8">
        <Card className="rounded-2xl p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <SectionTitle title="アカウント" />
              <h1 className="mt-2 text-3xl font-bold text-slate-50">
                利用状況
              </h1>
              <p className="mt-3 text-sm text-slate-400">
                {summary?.email ?? "ログイン中のメールアドレスを取得中..."}
              </p>
            </div>
            <Link href="/pricing">
              <Button>追加購入する</Button>
            </Link>
          </div>
          <AccountSummary usage={usage} />
          {summary?.needsPurchase ? (
            <div className="mt-6 rounded-lg border border-amber-400/30 bg-amber-950/20 p-4 text-sm text-amber-100">
              利用を続けるには追加購入してください。
            </div>
          ) : null}
          {message ? (
            <p className="mt-4 text-sm text-orange-300">{message}</p>
          ) : null}
        </Card>

        <Card className="rounded-2xl p-6">
          <SectionTitle title="文書別利用状況" />
          <DocumentUsageTable usage={usage} />
        </Card>

        <Card className="rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionTitle title="購入履歴" />
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              className="rounded-md border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-200"
            >
              {purchasePageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}件
                </option>
              ))}
            </select>
          </div>
          <PurchaseHistoryTable history={history} />
          <Pagination history={history} page={page} onPage={setPage} />
        </Card>
      </div>
    </AuthGate>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
      {title}
    </p>
  );
}
