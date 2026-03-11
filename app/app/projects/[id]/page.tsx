"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { ProjectForm, mapProjectToForm } from "@/components/project-form";
import { api, formatApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { ProjectDetail, ProjectFormValues } from "@/lib/types";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { billing } = useAuth();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await api.getProject(params.id);
        setProject(response);
      } catch (err) {
        setMessage(formatApiError(err).message);
      }
    }
    void load();
  }, [params.id]);

  async function persist(values: ProjectFormValues) {
    const updated = await api.updateProject(params.id, values);
    setProject(updated);
    return updated;
  }

  async function persistForForm(values: ProjectFormValues) {
    await persist(values);
  }

  async function generate(
    values: ProjectFormValues,
    mode: "preview" | "export",
    quality: "standard" | "high",
  ) {
    if (Date.now() < cooldownUntil) {
      throw new Error("30 秒待ってから再実行してください。");
    }

    try {
      setSubmitting(true);
      const updated = await persist(values);
      setCooldownUntil(Date.now() + 30_000);

      const response = await api.generateProject(
        params.id,
        { mode, quality },
        crypto.randomUUID(),
      );

      if (mode === "preview") {
        sessionStorage.setItem(
          `preview:${params.id}:${response.versionNo}`,
          JSON.stringify(response),
        );
        router.push(`/app/projects/${params.id}/preview?ver=${response.versionNo}`);
        return;
      }

      if (!response.paywall.canExport) {
        sessionStorage.setItem("pendingProjectId", params.id);
        const checkout = await api.checkoutOneshot();
        window.location.href = checkout.url;
        return;
      }

      window.location.href = api.getDownloadUrl(params.id, response.versionNo);
      setProject(updated);
    } catch (err) {
      throw new Error(formatApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("この案件を削除しますか？この操作は元に戻せません。")) {
      return;
    }

    try {
      setDeleting(true);
      await api.deleteProject(params.id);
      router.push("/app");
    } catch (err) {
      setMessage(formatApiError(err).message);
    } finally {
      setDeleting(false);
    }
  }

  if (!project) {
    return (
      <Card className="rounded-2xl p-6 text-sm text-slate-400">
        {message ?? "読み込み中..."}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
              Project Detail
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-50">
              {project.docTitle}
            </h1>
          </div>
          <div className="flex gap-3">
            <Button
              variant="danger"
              disabled={deleting || submitting}
              onClick={() => void handleDelete()}
            >
              削除
            </Button>
          </div>
        </div>
        {message ? <p className="mt-4 text-sm text-orange-300">{message}</p> : null}
        <div className="mt-6">
          <ProjectForm
            initialValues={mapProjectToForm(project)}
            submitting={submitting}
            onPreview={(values) => generate(values, "preview", "standard")}
            onExport={(values, quality) => generate(values, "export", quality)}
            onSave={persistForForm}
            allowHighQuality={
              billing?.planType === "PRO" || billing?.planType === "BUSINESS"
            }
          />
        </div>
      </Card>

      <Card className="rounded-2xl p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
          Versions
        </p>
        <div className="mt-4 grid gap-3">
          {project.versions.map((version) => (
            <div
              key={version.versionNo}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-4"
            >
              <div>
                <p className="font-medium text-slate-100">Version {version.versionNo}</p>
                <p className="text-sm text-slate-500">
                  {new Date(version.createdAt).toLocaleString("ja-JP")}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/app/projects/${params.id}/preview?ver=${version.versionNo}`}>
                  <Button variant="secondary">Preview</Button>
                </Link>
                <a href={api.getDownloadUrl(params.id, version.versionNo)}>
                  <Button>Download</Button>
                </a>
              </div>
            </div>
          ))}
          {project.versions.length === 0 ? (
            <p className="text-sm text-slate-500">まだバージョンはありません。</p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
