import type { DocumentPageConfig, GenerationMode } from "@/lib/document-configs";
import type { DocumentSourceType, DocumentSummary } from "@/lib/types";

export function SourceSelector({
  config,
  sourceType,
  versions,
  sourceVersionId,
  onSource,
  onVersion,
}: {
  config: DocumentPageConfig;
  sourceType: DocumentSourceType;
  versions: DocumentSummary["versions"];
  sourceVersionId: string;
  onSource: (value: DocumentSourceType) => void;
  onVersion: (value: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="space-y-2">
        <span className="text-sm text-slate-300">入力ソース</span>
        <select value={sourceType} onChange={(event) => onSource(event.target.value as DocumentSourceType)} className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-100">
          {config.sourceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
      {sourceType.endsWith("_VERSION") ? (
        <label className="space-y-2">
          <span className="text-sm text-slate-300">バージョン</span>
          <select value={sourceVersionId} onChange={(event) => onVersion(event.target.value)} className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-100">
            {versions.map((version) => <option key={version.id} value={version.id}>v{version.versionNo}</option>)}
          </select>
        </label>
      ) : null}
    </div>
  );
}

export function GenerationModeSelector({
  modes,
  value,
  onChange,
}: {
  modes: GenerationMode[];
  value: GenerationMode;
  onChange: (value: GenerationMode) => void;
}) {
  const labels: Record<GenerationMode, string> = { standard: "標準版", simple: "簡易版", custom: "カスタム" };
  return (
    <div className="flex flex-wrap gap-3">
      {modes.map((mode) => (
        <label key={mode} className="flex items-center gap-2 text-sm text-slate-300">
          <input type="radio" checked={value === mode} onChange={() => onChange(mode)} />
          {labels[mode]}{mode === "standard" ? "（推奨）" : ""}
        </label>
      ))}
    </div>
  );
}
