"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { api } from "@/lib/api";

export default function SuccessPage() {
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("pendingProjectId");
    if (stored) {
      setPendingProjectId(stored);
      void api
        .getProject(stored)
        .catch(() => null)
        .finally(() => sessionStorage.removeItem("pendingProjectId"));
    }
  }, []);

  return (
    <div className="py-8">
      <Card className="rounded-2xl p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
          Payment Success
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-50">
          決済処理を受け付けました
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          Webhook 反映後、案件ページからダウンロードまたは追加生成ができます。すぐ反映しない場合はアカウント画面または案件画面を再読み込みしてください。
        </p>
        <div className="mt-6 flex gap-3">
          {pendingProjectId ? (
            <Link href={`/app/projects/${pendingProjectId}`}>
              <Button>購入した案件へ戻る</Button>
            </Link>
          ) : (
            <Link href="/app">
              <Button>Workspace へ戻る</Button>
            </Link>
          )}
          <Link href="/account">
            <Button variant="secondary">Account</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
