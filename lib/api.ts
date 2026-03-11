"use client";

import type {
  AuthMeResponse,
  BillingSummary,
  GenerateResponse,
  ProjectDetail,
  ProjectFormValues,
  ProjectSummary,
  ProjectVersionResponse,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3002";

type ApiError = Error & {
  status?: number;
  requestId?: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const payload = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    const error = new Error(
      payload?.message ?? "Request failed",
    ) as ApiError;
    error.status = response.status;
    error.requestId = response.headers.get("x-request-id") ?? undefined;
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function toProjectPayload(values: ProjectFormValues) {
  const { docTitle, minutesText, ...rest } = values;
  return {
    docTitle,
    minutesText,
    formFields: rest,
  };
}

export const api = {
  request,
  getAuthMe: () => request<AuthMeResponse>("/auth/me"),
  getBillingSummary: () => request<BillingSummary>("/billing/me"),
  getProjects: () => request<ProjectSummary[]>("/projects"),
  getProject: (id: string) => request<ProjectDetail>(`/projects/${id}`),
  getProjectVersion: (id: string, versionNo: number) =>
    request<ProjectVersionResponse>(`/projects/${id}/versions/${versionNo}`),
  createProject: (values: ProjectFormValues) =>
    request<{ id: string; docTitle: string; updatedAt: string }>("/projects", {
      method: "POST",
      body: JSON.stringify(toProjectPayload(values)),
    }),
  updateProject: (id: string, values: ProjectFormValues) =>
    request<ProjectDetail>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(toProjectPayload(values)),
    }),
  deleteProject: (id: string) =>
    request<{ ok: true }>(`/projects/${id}`, { method: "DELETE" }),
  startEmailLogin: (email: string) =>
    request<{ ok: true }>("/auth/start", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  verifyEmailLogin: (email: string, code: string) =>
    request<{ token: string; user: { id: string; email: string } }>(
      "/auth/verify",
      {
        method: "POST",
        body: JSON.stringify({ email, code }),
      },
    ),
  verifyGoogleLogin: (idToken: string) =>
    request<{ token: string; user: { id: string; email: string } }>(
      "/auth/google",
      {
        method: "POST",
        body: JSON.stringify({ idToken }),
      },
    ),
  logout: () => request<{ ok: true }>("/auth/logout", { method: "POST" }),
  generateProject: (
    id: string,
    payload: { mode: "preview" | "export"; quality: "standard" | "high" },
    idempotencyKey?: string,
  ) =>
    request<GenerateResponse>(`/projects/${id}/generate`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {},
    }),
  checkoutOneshot: () =>
    request<{ url: string }>("/billing/checkout/oneshot", { method: "POST" }),
  checkoutSubscription: () =>
    request<{ url: string }>("/billing/checkout/subscription", {
      method: "POST",
    }),
  getBillingPortal: () => request<{ url: string }>("/billing/portal"),
  demoPreview: () =>
    request<GenerateResponse>("/demo/preview", {
      method: "POST",
      body: JSON.stringify({}),
    }),
  getDownloadUrl: (projectId: string, versionNo: number) =>
    `${API_BASE_URL}/projects/${projectId}/versions/${versionNo}/download`,
};

export function formatApiError(error: unknown) {
  const apiError = error as ApiError;
  return {
    message: apiError.message || "未知错误",
    requestId: apiError.requestId,
    status: apiError.status,
  };
}
