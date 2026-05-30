"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { DocumentSummary, ProjectSummary } from "@/lib/types";
import {
  WORKSPACE_TREE_REFRESH_EVENT,
  type WorkspaceTreeRefreshDetail,
} from "@/lib/workspace-events";
import { WorkspaceProjectNode } from "./workspace-project-node";
import { navClass, workspaceLinks } from "./workspace-sidebar-config";

type Trees = Record<string, DocumentSummary[]>;

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [trees, setTrees] = useState<Trees>({});
  const activeProjectId = pathname.match(/^\/app\/projects\/([^/]+)/)?.[1];
  const activeDocSlug = pathname.match(/\/documents\/([^/?]+)/)?.[1];
  const activeVersion = searchParams.get("version");

  const loadProjects = useCallback(async () => {
    try {
      const result = await api.getProjects();
      setProjects(result);
    } catch {
      setProjects([]);
    }
  }, []);

  const loadTree = useCallback(async (projectId: string) => {
    try {
      const tree = await api.getDocumentTree(projectId);
      setTrees((current) => ({ ...current, [projectId]: tree }));
    } catch {
      setTrees((current) => ({ ...current, [projectId]: [] }));
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void loadProjects());
  }, [loadProjects]);

  useEffect(() => {
    if (!activeProjectId) return;
    queueMicrotask(() => void loadTree(activeProjectId));
  }, [activeProjectId, loadTree]);

  useEffect(() => {
    const refresh = (event: Event) => {
      const detail = (event as CustomEvent<WorkspaceTreeRefreshDetail>).detail;
      void loadProjects();
      const projectIds = detail?.projectId
        ? [detail.projectId]
        : Object.keys(expanded).filter((id) => expanded[id]);
      projectIds.forEach((projectId) => void loadTree(projectId));
    };
    window.addEventListener(WORKSPACE_TREE_REFRESH_EVENT, refresh);
    return () =>
      window.removeEventListener(WORKSPACE_TREE_REFRESH_EVENT, refresh);
  }, [expanded, loadProjects, loadTree]);

  const projectRows = useMemo(
    () => projects.map((project) => ({ ...project, name: project.docTitle })),
    [projects],
  );

  async function toggleProject(projectId: string) {
    const nextExpanded = !expanded[projectId];
    setExpanded((current) => ({ ...current, [projectId]: nextExpanded }));
    if (nextExpanded && !trees[projectId]) await loadTree(projectId);
  }

  return (
    <aside className="panel flex max-h-[calc(100vh-120px)] flex-col rounded-2xl p-5">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
        Workspace
      </p>
      <nav className="mt-6 flex flex-col gap-2 text-sm">
        {workspaceLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={navClass(
              link.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(link.href),
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-7 border-t border-slate-800 pt-5">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
          Projects
        </p>
      </div>
      <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {projectRows.length ? (
          projectRows.map((project) => (
            <WorkspaceProjectNode
              key={project.id}
              projectId={project.id}
              name={project.name}
              expanded={Boolean(
                expanded[project.id] || activeProjectId === project.id,
              )}
              tree={trees[project.id] ?? []}
              activeProjectId={activeProjectId}
              activeDocSlug={activeDocSlug}
              activeVersion={activeVersion}
              onToggle={() => void toggleProject(project.id)}
            />
          ))
        ) : (
          <p className="text-sm text-slate-500">案件はまだありません。</p>
        )}
      </div>
    </aside>
  );
}
