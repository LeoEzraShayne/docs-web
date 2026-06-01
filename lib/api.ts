"use client";

import type {
  AuthMeResponse,
  BillingSummary,
  AccountUsageResponse,
  PurchaseHistoryResponse,
  GenerateResponse,
  DocumentSummary,
  DocumentType,
  DocumentVersionResult,
  GenerateDocumentPayload,
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
      translateApiMessage(payload?.message ?? "Request failed"),
    ) as ApiError;
    error.status = response.status;
    error.requestId =
      response.headers.get("x-request-id") ?? payload?.requestId ?? undefined;
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
  getAccountUsage: () => request<AccountUsageResponse>("/billing/account-usage"),
  getPurchaseHistory: (page: number, pageSize: number) =>
    request<PurchaseHistoryResponse>(
      `/billing/purchases?page=${page}&pageSize=${pageSize}`,
    ),
  getProjects: () => request<ProjectSummary[]>("/projects"),
  getProject: (id: string) => request<ProjectDetail>(`/projects/${id}`),
  getProjectVersion: (id: string, versionNo: number) =>
    request<ProjectVersionResponse>(`/projects/${id}/versions/${versionNo}`),
  getDocuments: (projectId: string) =>
    request<DocumentSummary[]>(`/projects/${projectId}/documents`),
  getDocumentTree: (projectId: string) =>
    request<DocumentSummary[]>(`/projects/${projectId}/documents/tree`),
  getDocument: (projectId: string, type: DocumentType) =>
    request<DocumentSummary>(`/projects/${projectId}/documents/${type}`),
  generateDocument: (
    projectId: string,
    type: DocumentType,
    payload: GenerateDocumentPayload,
    idempotencyKey?: string,
  ) =>
    request<DocumentVersionResult>(
      `/projects/${projectId}/documents/${type}/generate`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {},
      },
    ),
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
    request<{ ok: true; emailSent?: boolean; devCode?: string }>("/auth/start", {
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
  checkoutSingleDocument: (
    documentType?: DocumentType,
    context?: { projectId?: string; documentId?: string | null },
  ) =>
    request<{ url: string }>("/billing/checkout/single-document", {
      method: "POST",
      body: JSON.stringify({
        documentType,
        projectId: context?.projectId,
        documentId: context?.documentId ?? undefined,
      }),
    }),
  confirmCheckout: (sessionId: string) =>
    request<{ ok: true; skipped?: true }>("/billing/checkout/confirm", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    }),
  checkoutBusinessPack: () =>
    request<{ url: string }>("/billing/checkout/business-pack", {
      method: "POST",
    }),
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
  getDocumentDownloadUrl: (
    projectId: string,
    type: DocumentType,
    versionNo: number,
  ) =>
    `${API_BASE_URL}/projects/${projectId}/documents/${type}/versions/${versionNo}/download`,
};

export function formatApiError(error: unknown) {
  const apiError = error as ApiError;
  return {
    message: translateApiMessage(apiError.message || "エラーが発生しました。"),
    requestId: apiError.requestId,
    status: apiError.status,
  };
}

function translateApiMessage(message: unknown) {
  const raw = Array.isArray(message) ? message.join(" / ") : String(message);
  const translations: Record<string, string> = {
    "Request failed": "リクエストに失敗しました。",
    "Free tier project limit reached":
      "無料プランの案件作成上限に達しました。不要な案件を削除するか、文書枠を購入してから続行してください。",
    "minutesText exceeds 20,000 characters":
      "議事録は20,000文字以内にしてください。",
    "Project not found": "案件が見つかりません。",
    "Project does not belong to user":
      "この案件にアクセスする権限がありません。",
    "Version not found": "バージョンが見つかりません。",
    "Preview limit reached for today":
      "本日の無料プレビュー上限に達しました。",
    "Preview unavailable beyond free limit":
      "無料プレビューの上限を超えています。",
    "Demo daily limit reached":
      "本日のデモ利用上限に達しました。",
    "No document generation entitlement":
      "文書生成に利用できる購入枠がありません。",
    "No document generations remaining":
      "この文書の残り生成回数がありません。",
    "Checkout session does not belong to user":
      "決済情報のユーザー確認に失敗しました。",
    "Checkout session is not paid": "決済が完了していません。",
    "Invalid document type": "文書種別が正しくありません。",
    "Invalid code": "認証コードが正しくありません。",
    "Too many requests from this IP":
      "アクセスが集中しています。しばらくしてからもう一度お試しください。",
    "Please wait 60 seconds before retrying":
      "60秒後にもう一度お試しください。",
    "High quality requires Pro or Business":
      "高品質生成は Pro / Business のみ利用できます。",
    "No credits remaining": "利用可能な生成枠がありません。",
    "Entitlement not found": "利用状況が見つかりません。",
    "User not found": "ユーザーが見つかりません。",
    "Invalid Google token": "Googleログインの認証に失敗しました。",
    "GOOGLE_CLIENT_ID is not configured":
      "Googleログイン設定が不足しています。",
  };
  return translations[raw] ?? raw;
}
