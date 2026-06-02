"use client";

export const runtime = "edge";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { DocumentTreePanel } from "@/components/documents/document-tree-panel";
import { ProjectForm, mapProjectToForm } from "@/components/project-form";
import { api, formatApiError } from "@/lib/api";
import { notifyWorkspaceTreeRefresh } from "@/lib/workspace-events";
import type {
  DocumentSummary,
  ProjectDetail,
  ProjectFormValues,
} from "@/lib/types";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);
  const [deleting, setDeleting] = useState(false);
  const documentTreeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [response, tree] = await Promise.all([
          api.getProject(params.id),
          api.getDocumentTree(params.id),
        ]);
        setProject(response);
        setDocuments(tree);
      } catch (err) {
        setMessage(formatApiError(err).message);
      }
    }
    void load();
  }, [params.id]);

  useEffect(() => {
    if (project && window.location.hash === "#document-tree") {
      window.setTimeout(() => scrollToDocumentTree(), 0);
    }
  }, [project]);

  async function persist(values: ProjectFormValues) {
    const updated = await api.updateProject(params.id, values);
    setProject(updated);
    notifyWorkspaceTreeRefresh({ projectId: params.id });
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
      await persist(values);
      setCooldownUntil(Date.now() + 30_000);

      const response = await api.generateProject(
        params.id,
        { mode, quality },
        crypto.randomUUID(),
      );
      notifyWorkspaceTreeRefresh({ projectId: params.id });

      if (mode === "preview") {
        sessionStorage.setItem(
          `preview:${params.id}:${response.versionNo}`,
          JSON.stringify(response),
        );
        router.push(
          `/app/projects/${params.id}/preview?ver=${response.versionNo}`,
        );
        return;
      }

      scrollToDocumentTree();
    } catch (err) {
      throw new Error(formatApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function selectDocumentForExport(values: ProjectFormValues) {
    try {
      setSubmitting(true);
      await persist(values);
      scrollToDocumentTree();
    } catch (err) {
      throw new Error(formatApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  }

  function scrollToDocumentTree() {
    documentTreeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function handleDelete() {
    if (!window.confirm("この案件を削除しますか？この操作は元に戻せません。")) {
      return;
    }

    try {
      setDeleting(true);
      await api.deleteProject(params.id);
      notifyWorkspaceTreeRefresh({});
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
              案件詳細
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
        {message ? (
          <p className="mt-4 text-sm text-orange-300">{message}</p>
        ) : null}
        <div className="mt-6">
          <ProjectForm
            initialValues={mapProjectToForm(project)}
            submitting={submitting}
            onPreview={(values) => generate(values, "preview", "standard")}
            onExport={(values) => selectDocumentForExport(values)}
            onSave={persistForForm}
          />
        </div>
      </Card>

      <div ref={documentTreeRef} id="document-tree" className="scroll-mt-24">
        <Card className="rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            文書ツリー
          </p>
          <div className="mt-4">
            <DocumentTreePanel projectId={params.id} documents={documents} />
          </div>
        </Card>
      </div>

      <Card className="rounded-2xl p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
          バージョン
        </p>
        <div className="mt-4 grid gap-3">
          {project.versions.map((version) => (
            <div
              key={version.versionNo}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-4"
            >
              <div>
                <p className="font-medium text-slate-100">
                  バージョン {version.versionNo}
                </p>
                <p className="text-sm text-slate-500">
                  {new Date(version.createdAt).toLocaleString("ja-JP")}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/app/projects/${params.id}/preview?ver=${version.versionNo}`}
                >
                  <Button variant="secondary">プレビュー</Button>
                </Link>
                <a href={api.getDownloadUrl(params.id, version.versionNo)}>
                  <Button>ダウンロード</Button>
                </a>
              </div>
            </div>
          ))}
          {project.versions.length === 0 ? (
            <p className="text-sm text-slate-500">
              まだバージョンはありません。
            </p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
