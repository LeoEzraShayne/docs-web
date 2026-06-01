"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { api } from "@/lib/api";

export default function SuccessPage() {
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null);
  const [message, setMessage] = useState(
    "決済内容を確認しています。反映まで少しお待ちください。",
  );

  useEffect(() => {
    queueMicrotask(() => {
      const sessionId = new URLSearchParams(window.location.search).get(
        "session_id",
      );
      const stored = sessionStorage.getItem("pendingProjectId");
      if (sessionId) {
        void api
          .confirmCheckout(sessionId)
          .then(() => setMessage("購入内容を反映しました。"))
          .catch(() =>
            setMessage(
              "購入確認を完了できませんでした。少し待ってから再読み込みしてください。",
            ),
          );
      } else {
        setMessage("購入内容を反映しました。");
      }
      if (!stored) {
        return;
      }
      setPendingProjectId(stored);
      void api
        .getProject(stored)
        .catch(() => null)
        .finally(() => sessionStorage.removeItem("pendingProjectId"));
    });
  }, []);

  return (
    <div className="py-8">
      <Card className="rounded-2xl p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
          決済完了
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-50">
          決済処理を受け付けました
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          {message}
        </p>
        <div className="mt-6 flex gap-3">
          {pendingProjectId ? (
            <Link href={`/app/projects/${pendingProjectId}`}>
              <Button>購入した案件へ戻る</Button>
            </Link>
          ) : (
            <Link href="/app">
              <Button>ワークスペースへ戻る</Button>
            </Link>
          )}
          <Link href="/account">
            <Button variant="secondary">アカウント</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
