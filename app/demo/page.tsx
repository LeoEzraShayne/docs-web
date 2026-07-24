"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { DataTable } from "@/components/data-table";
import { Tabs } from "@/components/tabs";
import { api, formatApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { GenerateResponse } from "@/lib/types";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { previewTabDefinitions, resolvePreviewSchema } from "@/lib/preview-schema";

const DEMO_PREVIEW_CACHE_KEY = "docs-demo-preview";

export default function DemoPage() {
  const { status } = useAuth();
  const [data, setData] = useState<GenerateResponse | null>(null);
  const [activeTab, setActiveTab] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const createHref =
    status === "authenticated" ? "/app/new" : "/login?next=/app/new";
  const schema = data ? resolvePreviewSchema(data.schema, data.tabs) : null;
  const tabDefinitions = data
    ? previewTabDefinitions(data.schema, data.tabs)
    : [];
  const selectedTab = activeTab || tabDefinitions[0]?.key || "";

  useEffect(() => {
    async function run() {
      const cached = readCachedPreview();
      if (cached) {
        setData(cached);
        setLoading(false);
        setMessage("");
        return;
      }

      try {
        setLoading(true);
        const response = await api.demoPreview();
        setData(response);
        sessionStorage.setItem(
          DEMO_PREVIEW_CACHE_KEY,
          JSON.stringify(response),
        );
        setMessage("");
      } catch (err) {
        const formatted = formatApiError(err);
        if (formatted.status === 429) {
          setMessage(formatted.message);
          return;
        }
        setMessage(formatted.message);
      } finally {
        setLoading(false);
      }
    }

    void run();
  }, []);

  return (
    <div className="space-y-6 py-8">
      <Card className="rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
              デモプレビュー
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-50">無料デモ</h1>
            <p className="mt-2 text-sm text-slate-400">
              デモではサーバー側で一部を伏せたプレビューのみ表示します。
            </p>
          </div>
          <div className="text-right">
            <Link href={createHref} onClick={() => trackAnalyticsEvent("seo_signup_click", { pagePath: "/demo", ctaPosition: "demo:hero" })}>
              <Button>自分の資料で作成する</Button>
            </Link>
            <p className="mt-2 text-xs text-slate-500">
              正式生成・Excel出力は 1文書 ¥980（税込）
            </p>
          </div>
        </div>
      </Card>

      {data ? (
        <Card className="rounded-2xl p-6">
          {schema === "legacy-v1" ? (
            <div className="mb-4 rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
              このキャッシュは旧形式です。再読み込み後の新しいデモでは正式12シートを表示します。
            </div>
          ) : (
            <div className="mb-4 rounded-lg border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
              正式な要件定義書12シートを表示しています。各シートは最大5行で、一部セルを制限表示します。
            </div>
          )}
          <Tabs
            tabs={tabDefinitions}
            active={selectedTab}
            onChange={setActiveTab}
          />
          <div className="mt-6">
            <DataTable rows={data.tabs[selectedTab] ?? []} preview />
          </div>
        </Card>
      ) : loading ? (
        <Card className="rounded-2xl p-6 text-sm text-slate-400">
          デモプレビューを読み込んでいます...
        </Card>
      ) : (
        <Card className="rounded-2xl border-amber-400/20 p-6 text-sm text-slate-400">
          {message}
        </Card>
      )}
    </div>
  );
}

function readCachedPreview() {
  try {
    const raw = sessionStorage.getItem(DEMO_PREVIEW_CACHE_KEY);
    return raw ? (JSON.parse(raw) as GenerateResponse) : null;
  } catch {
    sessionStorage.removeItem(DEMO_PREVIEW_CACHE_KEY);
    return null;
  }
}
