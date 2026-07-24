"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import {
  analyticsConsentChangeEvent,
  readAnalyticsConsent,
  setAnalyticsConsent,
} from "@/lib/analytics";

type Consent = "accepted" | "declined" | "loading" | null;

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(analyticsConsentChangeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(analyticsConsentChangeEvent, callback);
  };
}

function getConsentSnapshot(): Consent {
  return readAnalyticsConsent();
}

export function AnalyticsConsent() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const consent = useSyncExternalStore(subscribe, getConsentSnapshot, () => "loading");

  function choose(value: "accepted" | "declined") {
    setAnalyticsConsent(value);
  }

  if (!measurementId) return null;

  return (
    <>
      {consent === "accepted" ? (
        <>
          <Script
            id="docs-ga4-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="docs-ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${measurementId}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}
      {consent === null ? (
        <div
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-xl border border-slate-700 bg-slate-950 p-5 shadow-2xl"
          role="dialog"
          aria-label="アクセス解析Cookieの確認"
        >
          <p className="text-sm leading-7 text-slate-300">
            サイト改善のため、同意いただいた場合のみアクセス解析Cookieを使用します。入力した文書内容やメールアドレスは送信しません。
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              className="rounded-md border border-amber-400/70 bg-amber-400 px-4 py-2 text-sm font-medium text-slate-950"
              onClick={() => choose("accepted")}
            >
              同意する
            </button>
            <button
              className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300"
              onClick={() => choose("declined")}
            >
              同意しない
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
