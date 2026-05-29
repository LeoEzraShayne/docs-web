import Link from "next/link";
import { Button } from "@/components/button";
import { api } from "@/lib/api";
import type { DocumentSummary, DocumentType } from "@/lib/types";

const ROUTES: Record<DocumentType, string> = {
  REQUIREMENTS: "requirements",
  BASIC_DESIGN: "basic-design",
  DETAILED_DESIGN: "detailed-design",
  UNIT_TEST: "unit-test",
  INTEGRATION_TEST: "integration-test",
};

export function DocumentTreePanel({
  projectId,
  documents,
}: {
  projectId: string;
  documents: DocumentSummary[];
}) {
  return (
    <div className="grid gap-3">
      {documents.map((document) => (
        <div
          key={document.type}
          className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium text-slate-100">{document.title}</p>
              <p className="text-xs text-slate-500">
                現在:{" "}
                {document.currentVersion
                  ? `v${document.currentVersion}`
                  : "未生成"}
              </p>
            </div>
            <Link
              href={`/app/projects/${projectId}/documents/${ROUTES[document.type]}`}
            >
              <Button variant="secondary">開く</Button>
            </Link>
          </div>
          {document.versions.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {document.versions.map((version) => (
                <a
                  key={version.id}
                  className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300"
                  href={api.getDocumentDownloadUrl(
                    projectId,
                    document.type,
                    version.versionNo,
                  )}
                >
                  v{version.versionNo}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
