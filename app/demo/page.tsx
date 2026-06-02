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

const demoTabs = [
  { key: "flow", label: "FLOW" },
  { key: "screens", label: "SCREENS" },
  { key: "functions", label: "FUNCTIONS" },
  { key: "nfr", label: "NFR" },
  { key: "risks_issues", label: "RISKS" },
  { key: "glossary", label: "GLOSSARY" },
];

const DEMO_PREVIEW_CACHE_KEY = "docs-demo-preview";

export default function DemoPage() {
  const { status } = useAuth();
  const [data, setData] = useState<GenerateResponse | null>(null);
  const [activeTab, setActiveTab] = useState("flow");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const createHref =
    status === "authenticated" ? "/app/new" : "/login?next=/app/new";

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
            <Link href={createHref}>
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
          <Tabs tabs={demoTabs} active={activeTab} onChange={setActiveTab} />
          <div className="mt-6">
            <DataTable
              rows={data.tabs[activeTab as keyof typeof data.tabs]}
              preview
            />
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
