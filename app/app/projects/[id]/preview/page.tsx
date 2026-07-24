"use client";

export const runtime = "edge";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { DataTable } from "@/components/data-table";
import { Tabs } from "@/components/tabs";
import { api, formatApiError } from "@/lib/api";
import { formatCount } from "@/lib/format-number";
import type { GenerateResponse, ProjectVersionResponse } from "@/lib/types";
import { previewTabDefinitions, resolvePreviewSchema } from "@/lib/preview-schema";

function ProjectPreviewPageContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const versionNo = Number(searchParams.get("ver") ?? "0");
  const [activeTab, setActiveTab] = useState("");
  const [data, setData] = useState<
    GenerateResponse | ProjectVersionResponse | null
  >(null);
  const [message, setMessage] = useState("読み込み中...");

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
  const schema = resolvePreviewSchema(data.schema, tabs);
  const tabDefinitions = previewTabDefinitions(data.schema, tabs);
  const selectedTab = activeTab || tabDefinitions[0].key;
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
              プレビュー
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-50">
              {data.project.docTitle}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              バージョン {data.versionNo}
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
              <Link href={`/app/projects/${params.id}#document-tree`}>
                <Button variant="secondary">文書を選択してExcel生成</Button>
              </Link>
            )}
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Excel出力
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-100">
              {paywall.canExport ? "利用可能" : "未購入"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              残り生成枠
            </p>
            <p className="mt-2 text-2xl font-bold text-amber-200">
              {formatCount(paywall.remaining)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              表示行数
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-100">
              プレビュー制限中
            </p>
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl p-6">
        <div className="mb-4 rounded-lg border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          {schema === "legacy-v1"
            ? "旧形式バージョンです。保存済みの6タブをそのまま表示し、従来の方法でExcelをダウンロードできます。"
            : "正式な要件定義書12シートのプレビューです。列構造を保ったまま最大5行を表示し、一部セルは「正式生成後に表示」となります。"}
        </div>
        <Tabs tabs={tabDefinitions} active={selectedTab} onChange={setActiveTab} />
        <div className="mt-6">
          <DataTable rows={tabs[selectedTab] ?? []} preview />
        </div>
        {message ? (
          <p className="mt-4 text-sm text-orange-300">{message}</p>
        ) : null}
      </Card>
    </div>
  );
}

export default function ProjectPreviewPage() {
  return (
    <Suspense
      fallback={
        <Card className="rounded-2xl p-6 text-sm text-slate-400">
          読み込み中...
        </Card>
      }
    >
      <ProjectPreviewPageContent />
    </Suspense>
  );
}
