"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { SourceSelector, GenerationModeSelector } from "./document-controls";
import { DocumentFields, visibleFields } from "./document-fields";
import {
  ErrorCard,
  ProgressPanel,
  ResultPanel,
  SheetSelector,
  VersionsPanel,
} from "./document-status";
import {
  DOCUMENT_PAGE_CONFIGS,
  type GenerationMode,
} from "@/lib/document-configs";
import { api, formatApiError } from "@/lib/api";
import type {
  DocumentSourceType,
  DocumentSummary,
  DocumentType,
  ProjectDetail,
} from "@/lib/types";

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
  const [mode, setMode] = useState<GenerationMode>("standard");
  const [values, setValues] = useState<Record<string, string>>({});
  const [checks, setChecks] = useState<Record<string, string[]>>({
    testViewpoints: ["正常系", "異常系", "入力チェック", "API連携", "DB更新"],
  });
  const [selectedSheets, setSelectedSheets] = useState(config.sheets);
  const [status, setStatus] = useState<string | null>(null);
  const [percent, setPercent] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    versionNo: number;
    downloadUrl: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const [projectResponse, tree] = await Promise.all([
      api.getProject(params.id),
      api.getDocumentTree(params.id),
    ]);
    setProject(projectResponse);
    setDocuments(tree);
  }, [params.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const currentDocument = documents.find((item) => item.type === type);
  const sourceVersions = useMemo(() => {
    const sourceDocType = SOURCE_DOC[sourceType];
    return (
      documents.find((item) => item.type === sourceDocType)?.versions ?? []
    );
  }, [documents, sourceType]);

  useEffect(() => {
    setSourceVersionId(sourceVersions[0]?.id ?? "");
  }, [sourceVersions]);
  useEffect(() => {
    setSelectedSheets(
      mode === "simple"
        ? (config.simpleSheets ?? config.sheets)
        : config.sheets,
    );
  }, [mode, config]);

  function validate() {
    const fields = visibleFields(config.fields, sourceType);
    if (sourceType.endsWith("_VERSION") && !sourceVersionId)
      return "上流文書バージョンを選択してください。";
    const missing = fields.find(
      (field) => field.required && !values[field.key]?.trim(),
    );
    if (missing) return `${missing.label} は必須です。`;
    const tooLong = fields.find(
      (field) =>
        field.maxLength && (values[field.key]?.length ?? 0) > field.maxLength,
    );
    if (tooLong)
      return `${tooLong.label} は ${tooLong.maxLength} 文字以内です。`;
    if (mode === "custom" && selectedSheets.length < 1)
      return "少なくとも1つのシートを選択してください。";
    return null;
  }

  async function generate() {
    const validationError = validate();
    if (validationError) return setError(validationError);
    const timer = startProgress();
    try {
      setSubmitting(true);
      setError(null);
      setResult(null);
      const result = await api.generateDocument(
        params.id,
        type,
        {
          sourceType,
          sourceDocumentVersionId: sourceVersionId || undefined,
          inputJson: values,
          generationMode: mode,
          selectedSheets: mode === "custom" ? selectedSheets : undefined,
          testViewpoints: checks.testViewpoints,
          quality: "standard",
        },
        crypto.randomUUID(),
      );
      setStatus(config.progress.at(-1) ?? "完了しました");
      setPercent(100);
      await load();
      const downloadUrl = api.getDocumentDownloadUrl(
        params.id,
        type,
        result.versionNo,
      );
      setResult({ versionNo: result.versionNo, downloadUrl });
      triggerDownload(downloadUrl);
    } catch (err) {
      const formatted = formatApiError(err);
      setError(
        formatted.requestId
          ? `${formatted.message} | Request ID: ${formatted.requestId}`
          : formatted.message,
      );
    } finally {
      window.clearInterval(timer);
      setSubmitting(false);
    }
  }

  function triggerDownload(downloadUrl: string) {
    const link = window.document.createElement("a");
    link.href = downloadUrl;
    link.download = "";
    window.document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function startProgress() {
    setPercent(10);
    setStatus(config.progress[0]);
    return window.setInterval(() => {
      setPercent((current) => Math.min(current + 25, 90));
      setStatus((current) => {
        const index = Math.max(0, config.progress.indexOf(current ?? ""));
        return config.progress[Math.min(index + 1, config.progress.length - 2)];
      });
    }, 1200);
  }

  async function purchase() {
    const checkout = await api.checkoutSingleDocument();
    window.location.href = checkout.url;
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
          Document Generator
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-50">
          {config.title}
        </h1>
        <p className="mt-4 text-sm text-slate-300">
          案件: {project?.docTitle ?? "読み込み中..."}
        </p>
        {currentDocument?.grant ? (
          <p className="mt-2 text-xs text-slate-500">
            残り生成回数: {currentDocument.grant.remainingGenerations}
          </p>
        ) : null}
      </Card>
      <Card className="space-y-6 rounded-2xl p-6">
        <SourceSelector
          config={config}
          sourceType={sourceType}
          versions={sourceVersions}
          sourceVersionId={sourceVersionId}
          onSource={setSourceType}
          onVersion={setSourceVersionId}
        />
        <DocumentFields
          fields={visibleFields(config.fields, sourceType)}
          values={values}
          checks={checks}
          onValue={(key, value) =>
            setValues((current) => ({ ...current, [key]: value }))
          }
          onChecks={(key, value) =>
            setChecks((current) => ({ ...current, [key]: value }))
          }
        />
      </Card>
      <Card className="space-y-5 rounded-2xl p-6">
        <GenerationModeSelector
          modes={config.modes}
          value={mode}
          onChange={setMode}
        />
        {mode === "custom" ? (
          <SheetSelector
            sheets={config.sheets}
            selected={selectedSheets}
            onChange={setSelectedSheets}
          />
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Button disabled={submitting} onClick={() => void generate()}>
            {submitting ? "生成中..." : config.submitLabel}
          </Button>
          <Button variant="secondary" onClick={() => void purchase()}>
            1文書を購入
          </Button>
        </div>
        <ProgressPanel status={status} percent={percent} />
        <ErrorCard message={error} />
        <ResultPanel
          versionNo={result?.versionNo ?? null}
          downloadUrl={result?.downloadUrl ?? null}
        />
      </Card>
      <Card className="rounded-2xl p-6">
        <p className="mb-4 text-xs uppercase tracking-[0.28em] text-slate-500">
          Versions
        </p>
        <VersionsPanel
          projectId={params.id}
          type={type}
          versions={currentDocument?.versions ?? []}
        />
      </Card>
    </div>
  );
}
