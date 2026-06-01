"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import { projectFormPageCopy } from "@/lib/copy/project-form-copy";
import { projectFormFields } from "@/lib/project-form-config";
import type { ProjectFormValues } from "@/lib/types";

export { emptyProjectForm, mapProjectToForm } from "@/lib/project-form-values";

export function ProjectForm({
  initialValues,
  submitting,
  onPreview,
  onExport,
  onSave,
}: {
  initialValues: ProjectFormValues;
  submitting: boolean;
  onPreview: (values: ProjectFormValues) => Promise<void>;
  onExport: (
    values: ProjectFormValues,
    quality: "standard" | "high",
  ) => Promise<void>;
  onSave?: (values: ProjectFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<ProjectFormValues>(initialValues);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  function update(key: keyof ProjectFormValues, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(
    action: "preview" | "export" | "save",
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const missingRequiredField = projectFormFields.find(
      (field) => field.required && !String(values[field.key] ?? "").trim(),
    );

    if (missingRequiredField) {
      setError(
        missingRequiredField.validationMessage ??
          `${missingRequiredField.label} は必須です。`,
      );
      return;
    }

    if (values.minutesText.length > 20000) {
      setError("議事録は 20,000 文字以内にしてください。");
      return;
    }

    try {
      setError(null);
      if (action === "preview") {
        await onPreview(values);
      } else if (action === "export") {
        await onExport(values, "standard");
      } else if (onSave) {
        await onSave(values);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "処理に失敗しました。");
    }
  }

  return (
    <form className="space-y-6" onSubmit={(event) => submit("preview", event)}>
      <div className="grid gap-4 md:grid-cols-2">
        {projectFormFields.map((field) => {
          const value = values[field.key];
          const isMinutes = field.key === "minutesText";
          const wide = field.multiline || isMinutes;
          return (
            <label
              key={field.key}
              className={`space-y-2 ${wide ? "md:col-span-2" : ""}`}
            >
              <span className="text-sm text-slate-300">
                {field.label}
                {field.required ? (
                  <span className="ml-2 text-xs text-amber-300">必須</span>
                ) : null}
              </span>
              {field.multiline ? (
                <textarea
                  rows={isMinutes ? 10 : 4}
                  value={value}
                  placeholder={field.placeholder}
                  onChange={(event) => update(field.key, event.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500"
                />
              ) : (
                <input
                  value={value}
                  placeholder={field.placeholder}
                  onChange={(event) => update(field.key, event.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500"
                />
              )}
              {field.helper ? (
                <span className="block text-xs leading-relaxed text-slate-500">
                  {field.helper}
                </span>
              ) : null}
            </label>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={submitting}>
          プレビュー生成（無料）
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={submitting}
          onClick={(event) =>
            void submit("export", event as unknown as React.FormEvent<HTMLFormElement>)
          }
        >
          文書を選択してExcel生成
        </Button>
        {onSave ? (
          <Button
            type="button"
            variant="ghost"
            disabled={submitting}
            onClick={(event) =>
              void submit("save", event as unknown as React.FormEvent<HTMLFormElement>)
            }
          >
            下書き保存
          </Button>
        ) : null}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {projectFormPageCopy.unpaidPreviewLimit}
        </span>
        <span>{values.minutesText.length} / 20000</span>
      </div>

      {error ? <p className="text-sm text-orange-300">{error}</p> : null}
    </form>
  );
}
