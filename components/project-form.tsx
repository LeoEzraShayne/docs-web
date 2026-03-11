"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import type { ProjectFormValues } from "@/lib/types";

const fieldOrder: Array<{
  key: keyof ProjectFormValues;
  label: string;
  multiline?: boolean;
  required?: boolean;
}> = [
  { key: "docTitle", label: "案件タイトル" },
  { key: "industry", label: "業界", required: true },
  { key: "systemType", label: "システム種別", required: true },
  { key: "purpose", label: "目的", required: true, multiline: true },
  { key: "background", label: "背景", multiline: true },
  { key: "goals", label: "ゴール", multiline: true },
  { key: "inScope", label: "対象範囲", multiline: true },
  { key: "outScope", label: "対象外", multiline: true },
  { key: "assumptions", label: "前提条件", multiline: true },
  { key: "constraints", label: "制約", multiline: true },
  { key: "rolesText", label: "関係者", multiline: true },
  { key: "minutesText", label: "議事録", multiline: true, required: true },
];

export function emptyProjectForm(): ProjectFormValues {
  return {
    docTitle: "",
    industry: "",
    systemType: "",
    purpose: "",
    background: "",
    goals: "",
    inScope: "",
    outScope: "",
    assumptions: "",
    constraints: "",
    rolesText: "",
    minutesText: "",
  };
}

export function mapProjectToForm(project: {
  docTitle?: string;
  minutesText?: string;
  formFields?: Record<string, unknown>;
}): ProjectFormValues {
  const fields = project.formFields ?? {};
  return {
    docTitle: project.docTitle ?? "",
    industry: String(fields.industry ?? ""),
    systemType: String(fields.systemType ?? ""),
    purpose: String(fields.purpose ?? ""),
    background: String(fields.background ?? ""),
    goals: String(fields.goals ?? ""),
    inScope: String(fields.inScope ?? ""),
    outScope: String(fields.outScope ?? ""),
    assumptions: String(fields.assumptions ?? ""),
    constraints: String(fields.constraints ?? ""),
    rolesText: String(fields.rolesText ?? ""),
    minutesText: project.minutesText ?? "",
  };
}

export function ProjectForm({
  initialValues,
  submitting,
  onPreview,
  onExport,
  onSave,
  allowHighQuality = false,
}: {
  initialValues: ProjectFormValues;
  submitting: boolean;
  onPreview: (values: ProjectFormValues) => Promise<void>;
  onExport: (
    values: ProjectFormValues,
    quality: "standard" | "high",
  ) => Promise<void>;
  onSave?: (values: ProjectFormValues) => Promise<void>;
  allowHighQuality?: boolean;
}) {
  const [values, setValues] = useState<ProjectFormValues>(initialValues);
  const [quality, setQuality] = useState<"standard" | "high">("standard");
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
    const missingRequiredField = fieldOrder.find(
      (field) => field.required && !String(values[field.key] ?? "").trim(),
    );

    if (missingRequiredField) {
      setError(`${missingRequiredField.label} は必須です。`);
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
        await onExport(values, quality);
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
        {fieldOrder.map((field) => {
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
                  onChange={(event) => update(field.key, event.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500"
                />
              ) : (
                <input
                  value={value}
                  onChange={(event) => update(field.key, event.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500"
                />
              )}
            </label>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={submitting}>
          プレビュー生成（無料）
        </Button>
        <select
          value={quality}
          disabled={!allowHighQuality}
          onChange={(event) =>
            setQuality(event.target.value as "standard" | "high")
          }
          className="rounded-md border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="standard">standard</option>
          <option value="high">high</option>
        </select>
        <Button
          type="button"
          variant="secondary"
          disabled={submitting}
          onClick={(event) =>
            void submit("export", event as unknown as React.FormEvent<HTMLFormElement>)
          }
        >
          購入してExcel生成（有料）
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
        <span>未購入ユーザーはプレビュー 1 日 1 回まで</span>
        <span>{values.minutesText.length} / 20000</span>
      </div>
      {!allowHighQuality ? (
        <p className="text-xs text-slate-500">
          high 品質 export は Pro / Business のみ利用できます。
        </p>
      ) : null}

      {error ? <p className="text-sm text-orange-300">{error}</p> : null}
    </form>
  );
}
