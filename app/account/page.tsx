"use client";

import { useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { api, formatApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function AccountPage() {
  const { billing, refresh, user } = useAuth();
  const [message, setMessage] = useState<string | null>(null);

  async function openPortal() {
    try {
      const response = await api.getBillingPortal();
      window.location.href = response.url;
    } catch (err) {
      const formatted = formatApiError(err);
      setMessage(formatted.message);
    }
  }

  return (
    <AuthGate>
      <div className="space-y-6 py-8">
        <Card className="rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
            Account
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-50">利用状況</h1>
          <p className="mt-3 text-sm text-slate-400">
            {user?.email ?? "ログイン中のメールアドレスを取得中..."}
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Plan
              </p>
              <p className="mt-3 text-2xl font-bold text-slate-100">
                {billing?.planType ?? "-"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Remaining
              </p>
              <p className="mt-3 text-2xl font-bold text-amber-200">
                {billing?.remaining ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Period End
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-100">
                {billing?.periodEnd
                  ? new Date(billing.periodEnd).toLocaleDateString("ja-JP")
                  : "未設定"}
              </p>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button onClick={() => void refresh()}>更新</Button>
            <Button variant="secondary" onClick={() => void openPortal()}>
              Stripe 管理ページ
            </Button>
          </div>
          {message ? <p className="mt-4 text-sm text-orange-300">{message}</p> : null}
        </Card>
      </div>
    </AuthGate>
  );
}
