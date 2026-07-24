"use client";

import { useState, useSyncExternalStore } from "react";
import {
  analyticsConsentChangeEvent,
  disableAnalytics,
  readAnalyticsConsent,
  setAnalyticsConsent,
} from "@/lib/analytics";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(analyticsConsentChangeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(analyticsConsentChangeEvent, callback);
  };
}

export function CookieSettingsButton() {
  const [open, setOpen] = useState(false);
  const consent = useSyncExternalStore(subscribe, readAnalyticsConsent, () => null);
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const status = consent === "accepted" ? "同意済み" : consent === "declined" ? "拒否済み" : "未選択";

  return (
    <>
      <button className="hover:text-slate-200" type="button" onClick={() => setOpen(true)}>
        Cookie設定
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 px-4" role="dialog" aria-modal="true" aria-label="Cookie設定">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-50">Cookie設定</h2>
                <p className="mt-2 text-sm text-slate-400">現在の状態: <span className="font-medium text-slate-200">{status}</span></p>
              </div>
              <button className="text-2xl leading-none text-slate-400 hover:text-white" aria-label="閉じる" onClick={() => setOpen(false)}>×</button>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-300">
              Google Analytics 4 はサイト改善のためにのみ使用します。メールアドレス、入力内容、プロジェクトID、決済識別子は送信しません。
              {!measurementId ? " 現在の環境ではアクセス解析は無効です。" : ""}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-md bg-amber-400 px-4 py-2 text-sm font-medium text-slate-950" onClick={() => setAnalyticsConsent("accepted")}>同意する</button>
              <button className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200" onClick={disableAnalytics}>{consent === "accepted" ? "同意を撤回" : "同意しない"}</button>
              <button className="rounded-md px-4 py-2 text-sm text-slate-400" onClick={() => setOpen(false)}>閉じる</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
