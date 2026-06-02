"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Pagination } from "@/components/pagination";
import { api, formatApiError } from "@/lib/api";
import { formatCount } from "@/lib/format-number";
import type { ProjectPageResponse } from "@/lib/types";

const projectPageSizes = [12, 24, 48];

export default function WorkspacePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = readPositiveNumber(searchParams.get("page"), 1);
  const pageSize = readPageSize(searchParams.get("pageSize"));
  const [projectPage, setProjectPage] = useState<ProjectPageResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const response = await api.getProjectsPage(page, pageSize);
        setProjectPage(response);
        setError(null);
      } catch (err) {
        setError(formatApiError(err).message);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [page, pageSize]);

  const projects = projectPage?.items ?? [];
  const summary = projectPage?.summary;

  function updatePage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    params.set("pageSize", String(pageSize));
    router.push(`/app?${params.toString()}`);
  }

  function updatePageSize(nextPageSize: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.set("pageSize", String(nextPageSize));
    router.push(`/app?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
              案件
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-50">案件一覧</h1>
          </div>
          <Link href="/app/new">
            <Button>新規案件</Button>
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              合計
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-100">
              {formatCount(summary?.total)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              生成済み
            </p>
            <p className="mt-2 text-2xl font-bold text-amber-200">
              {formatCount(summary?.readyCount)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              最終更新
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-200">
              {summary?.latestUpdatedAt
                ? new Date(summary.latestUpdatedAt).toLocaleString("ja-JP")
                : "-"}
            </p>
          </div>
        </div>
      </Card>

      {loading ? (
        <Card className="rounded-2xl p-6 text-sm text-slate-400">
          読み込み中...
        </Card>
      ) : error ? (
        <Card className="rounded-2xl p-6 text-sm text-orange-300">{error}</Card>
      ) : (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
            <span>{formatCount(projectPage?.total)}件の案件</span>
            <select
              value={pageSize}
              onChange={(event) => updatePageSize(Number(event.target.value))}
              className="rounded-md border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-200"
            >
              {projectPageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}件
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/app/projects/${project.id}?page=${page}&pageSize=${pageSize}`}
              >
                <Card className="min-h-[144px] rounded-xl p-4 transition hover:border-amber-400/40">
                  <div className="flex h-full flex-col justify-between gap-6">
                    <div>
                      <p className="line-clamp-2 text-base font-semibold text-slate-100">
                        {project.docTitle}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        {new Date(project.updatedAt).toLocaleString("ja-JP")}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="rounded-md border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                        {project.status}
                      </p>
                      <span className="text-sm text-slate-500">開く</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          {projects.length === 0 ? (
            <Card className="rounded-2xl p-6 text-sm text-slate-500">
              まだ案件はありません。新規案件を作成してください。
            </Card>
          ) : null}
          <Pagination
            page={projectPage?.page ?? page}
            total={projectPage?.total ?? 0}
            totalPages={projectPage?.totalPages ?? 1}
            onPage={updatePage}
          />
        </div>
      )}
    </div>
  );
}

function readPositiveNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function readPageSize(value: string | null) {
  const parsed = Number(value);
  return projectPageSizes.includes(parsed) ? parsed : 12;
}
