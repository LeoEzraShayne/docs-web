"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { DataTable } from "@/components/data-table";
import { Tabs } from "@/components/tabs";
import { api, formatApiError } from "@/lib/api";
import type { GenerateResponse, ProjectVersionResponse } from "@/lib/types";

const previewTabs = [
  { key: "flow", label: "FLOW" },
  { key: "screens", label: "SCREENS" },
  { key: "functions", label: "FUNCTIONS" },
  { key: "nfr", label: "NFR" },
  { key: "risks_issues", label: "RISKS" },
  { key: "glossary", label: "GLOSSARY" },
];

function ProjectPreviewPageContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const versionNo = Number(searchParams.get("ver") ?? "0");
  const [activeTab, setActiveTab] = useState("flow");
  const [data, setData] = useState<GenerateResponse | ProjectVersionResponse | null>(null);
  const [message, setMessage] = useState("読み込み中...");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const cacheKey = `preview:${params.id}:${versionNo}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setData(JSON.parse(cached) as GenerateResponse);
        setMessage("");
        return;
      }

      try {
        const response = await api.getProjectVersion(params.id, versionNo);
        setData(response);
        setMessage("");
      } catch (err) {
        setMessage(formatApiError(err).message);
      }
    }

    void load();
  }, [params.id, versionNo]);

  if (!data) {
    return (
      <Card className="rounded-2xl p-6 text-sm text-slate-400">{message}</Card>
    );
  }

  const tabs = data.tabs;
  const paywall =
    "paywall" in data
      ? data.paywall
      : {
          canExport: true,
          remaining: 1,
        };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
              Preview
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-50">
              {data.project.docTitle}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Version {data.versionNo}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/app/projects/${params.id}`}>
              <Button variant="ghost">案件へ戻る</Button>
            </Link>
            {paywall.canExport ? (
              <a href={api.getDownloadUrl(params.id, versionNo)}>
                <Button>Excel ダウンロード</Button>
              </a>
            ) : (
              <Button
                variant="secondary"
                disabled={checkoutLoading}
                onClick={async () => {
                  try {
                    setCheckoutLoading(true);
                    sessionStorage.setItem("pendingProjectId", params.id);
                    const checkout = await api.checkoutOneshot();
                    window.location.href = checkout.url;
                  } catch (err) {
                    setMessage(formatApiError(err).message);
                  } finally {
                    setCheckoutLoading(false);
                  }
                }}
              >
                購入してダウンロード
              </Button>
            )}
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Export
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-100">
              {paywall.canExport ? "Available" : "Locked"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Remaining
            </p>
            <p className="mt-2 text-2xl font-bold text-amber-200">{paywall.remaining}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Rows Visible
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-100">
              Preview capped
            </p>
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl p-6">
        <div className="mb-4 rounded-lg border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          Preview は制限表示です。FUNCTIONS / NFR / RISKS では高価値カラムを隠し、最大 5 行まで表示します。
        </div>
        <Tabs tabs={previewTabs} active={activeTab} onChange={setActiveTab} />
        <div className="mt-6">
          <DataTable rows={tabs[activeTab as keyof typeof tabs]} preview />
        </div>
        {message ? <p className="mt-4 text-sm text-orange-300">{message}</p> : null}
      </Card>
    </div>
  );
}

export default function ProjectPreviewPage() {
  return (
    <Suspense fallback={<Card className="rounded-2xl p-6 text-sm text-slate-400">読み込み中...</Card>}>
      <ProjectPreviewPageContent />
    </Suspense>
  );
}
