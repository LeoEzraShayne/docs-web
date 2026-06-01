import { Button } from "@/components/button";
import { api } from "@/lib/api";
import { documentCommonCopy } from "@/lib/copy/document-page-copy";
import type { DocumentSummary, DocumentType } from "@/lib/types";

export function SheetSelector({
  sheets,
  selected,
  onChange,
}: {
  sheets: string[];
  selected: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <div className="grid gap-2 md:grid-cols-2">
      {sheets.map((sheet) => (
        <label
          key={sheet}
          className="flex items-center gap-2 text-sm text-slate-300"
        >
          <input
            type="checkbox"
            checked={selected.includes(sheet)}
            onChange={(event) =>
              onChange(
                event.target.checked
                  ? [...selected, sheet]
                  : selected.filter((item) => item !== sheet),
              )
            }
          />
          {sheet}
        </label>
      ))}
    </div>
  );
}

export function ProgressPanel({
  status,
  percent,
}: {
  status: string | null;
  percent: number;
}) {
  if (!status) return null;
  return (
    <div className="mt-4 space-y-2">
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-amber-300 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-sm text-amber-200">{status}</p>
    </div>
  );
}

export function ErrorCard({ message }: { message: string | null }) {
  return message ? (
    <div className="mt-4 rounded-lg border border-orange-500/40 bg-orange-950/30 p-4 text-sm text-orange-200">
      {message}
    </div>
  ) : null;
}

export function ResultPanel({
  versionNo,
  downloadUrl,
}: {
  versionNo: number | null;
  downloadUrl: string | null;
}) {
  if (!versionNo || !downloadUrl) return null;
  return (
    <div className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-4">
      <p className="text-sm font-medium text-emerald-100">
        {documentCommonCopy.generationComplete(versionNo)}
      </p>
      <p className="mt-1 text-xs text-emerald-200/80">
        {documentCommonCopy.downloadStarted}
      </p>
      <a className="mt-3 inline-flex" href={downloadUrl}>
        <Button variant="secondary">{documentCommonCopy.redownload}</Button>
      </a>
    </div>
  );
}

export function VersionsPanel({
  projectId,
  type,
  versions,
}: {
  projectId: string;
  type: DocumentType;
  versions: DocumentSummary["versions"];
}) {
  return (
    <div className="grid gap-3">
      {versions.length ? (
        versions.map((version) => (
          <div
            key={version.id}
            className="flex items-center justify-between rounded-lg border border-slate-800 p-3"
          >
            <span className="text-sm text-slate-300">v{version.versionNo}</span>
            <a
              href={api.getDocumentDownloadUrl(
                projectId,
                type,
                version.versionNo,
              )}
            >
              <Button variant="ghost">{documentCommonCopy.redownload}</Button>
            </a>
          </div>
        ))
      ) : (
        <p className="text-sm text-slate-500">
          {documentCommonCopy.noVersions}
        </p>
      )}
    </div>
  );
}
