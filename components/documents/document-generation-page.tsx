"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { DOCUMENT_PAGE_CONFIGS } from "@/lib/document-configs";
import { api, formatApiError } from "@/lib/api";
import type { DocumentSourceType, DocumentSummary, DocumentType, ProjectDetail } from "@/lib/types";

const SOURCE_DOC: Partial<Record<DocumentSourceType, DocumentType>> = {
  REQUIREMENTS_VERSION: "REQUIREMENTS",
  BASIC_DESIGN_VERSION: "BASIC_DESIGN",
  DETAILED_DESIGN_VERSION: "DETAILED_DESIGN",
};

export function DocumentGenerationPage({ type }: { type: DocumentType }) {
  const params = useParams<{ id: string }>();
  const config = DOCUMENT_PAGE_CONFIGS[type];
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [sourceType, setSourceType] = useState<DocumentSourceType>(
    config.sourceOptions[0].value,
  );
  const [sourceVersionId, setSourceVersionId] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [selectedSheets, setSelectedSheets] = useState(config.sheets);
  const [customSheets, setCustomSheets] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [latestVersion, setLatestVersion] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [projectResponse, documentsResponse] = await Promise.all([
          api.getProject(params.id),
          api.getDocuments(params.id),
        ]);
        setProject(projectResponse);
        setDocuments(documentsResponse);
      } catch (err) {
        setError(formatApiError(err).message);
      }
    }
    void load();
  }, [params.id]);

  const sourceVersions = useMemo(() => {
    const sourceDocType = SOURCE_DOC[sourceType];
    return documents.find((document) => document.type === sourceDocType)?.versions ?? [];
  }, [documents, sourceType]);

  useEffect(() => {
    setSourceVersionId(sourceVersions[0]?.id ?? "");
  }, [sourceVersions]);

  function updateValue(key: string, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function validate() {
    if (sourceType.endsWith("_VERSION") && !sourceVersionId) {
      return "上流文書バージョンを選択してください。";
    }
    const missing = config.fields.find(
      (field) => field.required && !values[field.key]?.trim(),
    );
    if (missing && sourceType !== "PROJECT" && !sourceType.endsWith("_VERSION")) {
      return `${missing.label} は必須です。`;
    }
    const tooLong = config.fields.find(
      (field) => field.maxLength && (values[field.key]?.length ?? 0) > field.maxLength,
    );
    if (tooLong) return `${tooLong.label} は ${tooLong.maxLength} 文字以内です。`;
    if (selectedSheets.length < 1) return "少なくとも1つのシートを選択してください。";
    return null;
  }

  async function generate() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      setStatus(config.progress[0]);
      const timer = window.setInterval(() => {
        setStatus((current) => {
          const index = Math.max(0, config.progress.indexOf(current ?? ""));
          return config.progress[Math.min(index + 1, config.progress.length - 2)];
        });
      }, 1200);
      const result = await api.generateDocument(
        params.id,
        type,
        {
          sourceType,
          sourceDocumentVersionId: sourceVersionId || undefined,
          inputJson: values,
          selectedSheets,
          quality: "standard",
        },
        crypto.randomUUID(),
      );
      window.clearInterval(timer);
      setStatus(config.progress.at(-1) ?? "完了しました");
      setLatestVersion(result.versionNo);
      setDocuments(await api.getDocuments(params.id));
      window.location.href = api.getDocumentDownloadUrl(params.id, type, result.versionNo);
    } catch (err) {
      const formatted = formatApiError(err);
      setError(
        formatted.requestId
          ? `${formatted.message} | Request ID: ${formatted.requestId}`
          : formatted.message,
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function purchase() {
    const checkout = await api.checkoutSingleDocument();
    window.location.href = checkout.url;
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">Document Generator</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-50">{config.title}</h1>
        <div className="mt-4 text-sm text-slate-300">
          <span>案件: {project?.docTitle ?? "読み込み中..."}</span>
        </div>
      </Card>

      <Card className="rounded-2xl p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-slate-300">入力ソース</span>
            <select value={sourceType} onChange={(event) => setSourceType(event.target.value as DocumentSourceType)} className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-100">
              {config.sourceOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          {sourceType.endsWith("_VERSION") ? (
            <label className="space-y-2">
              <span className="text-sm text-slate-300">バージョン</span>
              <select value={sourceVersionId} onChange={(event) => setSourceVersionId(event.target.value)} className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-100">
                {sourceVersions.map((version) => (
                  <option key={version.id} value={version.id}>v{version.versionNo}</option>
                ))}
              </select>
            </label>
          ) : null}
        </div>

        <div className="mt-6 grid gap-4">
          {config.fields.map((field) => (
            <label key={field.key} className="space-y-2">
              <span className="text-sm text-slate-300">{field.label}{field.required ? <span className="ml-2 text-xs text-amber-300">必須</span> : null}</span>
              <textarea rows={4} value={values[field.key] ?? ""} maxLength={field.maxLength} onChange={(event) => updateValue(field.key, event.target.value)} className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100" />
              {field.maxLength ? <p className="text-right text-xs text-slate-500">{values[field.key]?.length ?? 0} / {field.maxLength}</p> : null}
            </label>
          ))}
        </div>
      </Card>

      <Card className="rounded-2xl p-6">
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={customSheets} onChange={(event) => setCustomSheets(event.target.checked)} />
          カスタムシートを選択
        </label>
        {customSheets ? (
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {config.sheets.map((sheet) => (
              <label key={sheet} className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={selectedSheets.includes(sheet)} onChange={(event) => setSelectedSheets((current) => event.target.checked ? [...current, sheet] : current.filter((item) => item !== sheet))} />
                {sheet}
              </label>
            ))}
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button disabled={submitting} onClick={() => void generate()}>{submitting ? "生成中..." : config.submitLabel}</Button>
          <Button variant="secondary" onClick={() => void purchase()}>1文書を購入</Button>
          {latestVersion ? <a href={api.getDocumentDownloadUrl(params.id, type, latestVersion)}><Button variant="ghost">Excelを再ダウンロード</Button></a> : null}
        </div>
        {status ? <p className="mt-4 text-sm text-amber-200">{status}</p> : null}
        {error ? <p className="mt-4 text-sm text-orange-300">{error}</p> : null}
      </Card>
    </div>
  );
}
