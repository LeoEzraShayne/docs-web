export const WORKSPACE_TREE_REFRESH_EVENT = "docs:document-version-created";

export type WorkspaceTreeRefreshDetail = {
  projectId?: string;
};

export function notifyWorkspaceTreeRefresh(detail: WorkspaceTreeRefreshDetail) {
  window.dispatchEvent(
    new CustomEvent<WorkspaceTreeRefreshDetail>(WORKSPACE_TREE_REFRESH_EVENT, {
      detail,
    }),
  );
}
