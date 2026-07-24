"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/card";
import { ProjectForm, emptyProjectForm } from "@/components/project-form";
import { api, formatApiError } from "@/lib/api";
import { projectFormPageCopy } from "@/lib/copy/project-form-copy";
import { notifyWorkspaceTreeRefresh } from "@/lib/workspace-events";
import type { ProjectFormValues } from "@/lib/types";
import { trackAnalyticsEvent } from "@/lib/analytics";

export default function NewProjectPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function createProject(values: ProjectFormValues) {
    const created = await api.createProject(values);
    trackAnalyticsEvent("project_create", { pagePath: "/app/new", ctaPosition: "project-form" });
    return created;
  }

  async function handlePreview(values: ProjectFormValues) {
    try {
      setSubmitting(true);
      const created = await createProject(values);
      const response = await api.generateProject(created.id, {
        mode: "preview",
        quality: "standard",
      });
      notifyWorkspaceTreeRefresh({ projectId: created.id });
      sessionStorage.setItem(
        `preview:${created.id}:${response.versionNo}`,
        JSON.stringify(response),
      );
      router.push(
        `/app/projects/${created.id}/preview?ver=${response.versionNo}`,
      );
    } catch (err) {
      throw new Error(formatApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleExport(values: ProjectFormValues) {
    try {
      setSubmitting(true);
      const created = await createProject(values);
      notifyWorkspaceTreeRefresh({ projectId: created.id });
      router.push(`/app/projects/${created.id}#document-tree`);
    } catch (err) {
      throw new Error(formatApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="rounded-2xl p-6">
      <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
        新規案件
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-50">新規案件作成</h1>
      <p className="mt-3 text-sm text-slate-400">
        {projectFormPageCopy.description}
      </p>
      <div className="mt-6">
        <ProjectForm
          initialValues={emptyProjectForm()}
          submitting={submitting}
          onPreview={handlePreview}
          onExport={handleExport}
        />
      </div>
    </Card>
  );
}
