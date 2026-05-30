import Link from "next/link";
import type { DocumentSummary } from "@/lib/types";
import {
  documentTreeNodes,
  treeClass,
  versionClass,
} from "./workspace-sidebar-config";

export function WorkspaceProjectNode({
  projectId,
  name,
  expanded,
  tree,
  activeProjectId,
  activeDocSlug,
  activeVersion,
  onToggle,
}: {
  projectId: string;
  name: string;
  expanded: boolean;
  tree: DocumentSummary[];
  activeProjectId?: string;
  activeDocSlug?: string;
  activeVersion: string | null;
  onToggle: () => void;
}) {
  const isProjectActive = activeProjectId === projectId;
  return (
    <div className="rounded-lg border border-slate-800/70 bg-slate-950/20">
      <div className="flex items-center gap-1 px-2 py-2">
        <button
          type="button"
          onClick={onToggle}
          className="h-6 w-6 text-slate-500 hover:text-amber-200"
          aria-label={expanded ? `${name}を閉じる` : `${name}を開く`}
        >
          {expanded ? "▾" : "▸"}
        </button>
        <Link
          href={`/app/projects/${projectId}`}
          className={`min-w-0 flex-1 truncate text-sm ${
            isProjectActive ? "text-amber-200" : "text-slate-300"
          }`}
        >
          {name || "無題の案件"}
        </Link>
      </div>
      {expanded ? (
        <DocumentLinks
          projectId={projectId}
          tree={tree}
          isProjectActive={isProjectActive}
          activeDocSlug={activeDocSlug}
          activeVersion={activeVersion}
        />
      ) : null}
    </div>
  );
}

function DocumentLinks({
  projectId,
  tree,
  isProjectActive,
  activeDocSlug,
  activeVersion,
}: {
  projectId: string;
  tree: DocumentSummary[];
  isProjectActive: boolean;
  activeDocSlug?: string;
  activeVersion: string | null;
}) {
  return (
    <div className="space-y-1 px-3 pb-3 pl-8">
      {documentTreeNodes.map((doc) => {
        const versions =
          tree.find((item) => item.type === doc.type)?.versions ?? [];
        const docActive = isProjectActive && activeDocSlug === doc.slug;
        return (
          <div key={doc.type}>
            <Link
              href={`/app/projects/${projectId}/documents/${doc.slug}`}
              className={treeClass(docActive)}
            >
              {doc.label}
            </Link>
            <VersionLinks
              projectId={projectId}
              docSlug={doc.slug}
              docActive={docActive}
              activeVersion={activeVersion}
              versions={versions}
            />
          </div>
        );
      })}
    </div>
  );
}

function VersionLinks({
  projectId,
  docSlug,
  docActive,
  activeVersion,
  versions,
}: {
  projectId: string;
  docSlug: string;
  docActive: boolean;
  activeVersion: string | null;
  versions: DocumentSummary["versions"];
}) {
  if (!versions.length) return null;
  return (
    <div className="mt-1 space-y-1 pl-4">
      {versions.map((version) => {
        const label = `v${version.versionNo}`;
        return (
          <Link
            key={version.id}
            href={`/app/projects/${projectId}/documents/${docSlug}?version=${label}`}
            className={versionClass(docActive && activeVersion === label)}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
