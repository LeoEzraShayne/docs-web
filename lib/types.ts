export type BillingSummary = {
  planType: "FREE" | "ONESHOT" | "STARTER" | "PRO" | "BUSINESS";
  remaining: number;
  periodEnd: string | null;
};

export type AuthMeResponse = {
  user: {
    id: string;
    email: string;
    authProvider: "google" | "email";
    createdAt: string;
  };
};

export type ProjectSummary = {
  id: string;
  docTitle: string;
  updatedAt: string;
  status: "DRAFT" | "READY" | "ARCHIVED";
};

export type ProjectDetail = {
  id: string;
  docTitle: string;
  formFields: Record<string, unknown>;
  minutesText: string;
  versions: Array<{
    versionNo: number;
    createdAt: string;
  }>;
};

export type GenerateTabs = {
  flow: Array<Record<string, unknown>>;
  screens: Array<Record<string, unknown>>;
  functions: Array<Record<string, unknown>>;
  nfr: Array<Record<string, unknown>>;
  risks_issues: Array<Record<string, unknown>>;
  glossary: Array<Record<string, unknown>>;
};

export type GenerateResponse = {
  project: {
    id: string;
    docTitle: string;
  };
  versionNo: number;
  tabs: GenerateTabs;
  paywall: {
    canExport: boolean;
    remaining: number;
  };
};

export type ProjectVersionResponse = {
  project: {
    id: string;
    docTitle: string;
  };
  versionNo: number;
  quality: string;
  tabs: GenerateTabs;
};

export type ProjectFormValues = {
  docTitle: string;
  industry: string;
  systemType: string;
  purpose: string;
  background: string;
  goals: string;
  inScope: string;
  outScope: string;
  assumptions: string;
  constraints: string;
  rolesText: string;
  minutesText: string;
};
