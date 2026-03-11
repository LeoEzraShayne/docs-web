"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/card";
import { ProjectForm, emptyProjectForm } from "@/components/project-form";
import { api, formatApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { ProjectFormValues } from "@/lib/types";

export default function NewProjectPage() {
  const router = useRouter();
  const { billing } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  async function createProject(values: ProjectFormValues) {
    return api.createProject(values);
  }

  async function handlePreview(values: ProjectFormValues) {
    try {
      setSubmitting(true);
      const created = await createProject(values);
      const response = await api.generateProject(created.id, {
        mode: "preview",
        quality: "standard",
      });
      sessionStorage.setItem(
        `preview:${created.id}:${response.versionNo}`,
        JSON.stringify(response),
      );
      router.push(`/app/projects/${created.id}/preview?ver=${response.versionNo}`);
    } catch (err) {
      throw new Error(formatApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleExport(
    values: ProjectFormValues,
    _quality: "standard" | "high",
  ) {
    try {
      setSubmitting(true);
      const created = await createProject(values);
      const checkout = await api.checkoutOneshot();
      sessionStorage.setItem("pendingProjectId", created.id);
      window.location.href = checkout.url;
    } catch (err) {
      throw new Error(formatApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="rounded-2xl p-6">
      <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
        New Project
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-50">新規案件作成</h1>
      <p className="mt-3 text-sm text-slate-400">
        入力後、無料 preview または Stripe checkout に進めます。
      </p>
      <div className="mt-6">
        <ProjectForm
          initialValues={emptyProjectForm()}
          submitting={submitting}
          onPreview={handlePreview}
          onExport={handleExport}
          allowHighQuality={
            billing?.planType === "PRO" || billing?.planType === "BUSINESS"
          }
        />
      </div>
    </Card>
  );
}
