"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { api, formatApiError } from "@/lib/api";
import type { ProjectSummary } from "@/lib/types";

export default function WorkspacePage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const response = await api.getProjects();
        setProjects(response);
      } catch (err) {
        setError(formatApiError(err).message);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const readyCount = projects.filter((project) => project.status === "READY").length;

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
              Projects
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
              Total
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-100">{projects.length}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Ready
            </p>
            <p className="mt-2 text-2xl font-bold text-amber-200">{readyCount}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Last Updated
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-200">
              {projects[0]
                ? new Date(projects[0].updatedAt).toLocaleString("ja-JP")
                : "-"}
            </p>
          </div>
        </div>
      </Card>

      {loading ? (
        <Card className="rounded-2xl p-6 text-sm text-slate-400">読み込み中...</Card>
      ) : error ? (
        <Card className="rounded-2xl p-6 text-sm text-orange-300">{error}</Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Link key={project.id} href={`/app/projects/${project.id}`}>
              <Card className="rounded-2xl p-5 transition hover:border-amber-400/40">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-100">
                      {project.docTitle}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {new Date(project.updatedAt).toLocaleString("ja-JP")}
                    </p>
                  </div>
                  <p className="rounded-md border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-sm text-amber-200">
                    {project.status}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
          {projects.length === 0 ? (
            <Card className="rounded-2xl p-6 text-sm text-slate-500">
              まだ案件はありません。新規案件を作成してください。
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
}
