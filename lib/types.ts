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

export type DocumentType =
  | "REQUIREMENTS"
  | "BASIC_DESIGN"
  | "DETAILED_DESIGN"
  | "UNIT_TEST"
  | "INTEGRATION_TEST";

export type DocumentSourceType =
  | "PROJECT"
  | "REQUIREMENTS_VERSION"
  | "BASIC_DESIGN_VERSION"
  | "DETAILED_DESIGN_VERSION"
  | "DIRECT_INPUT"
  | "PASTED_DESIGN";

export type DocumentSummary = {
  id: string;
  type: DocumentType;
  title: string;
  currentVersion: number;
  grant?: {
    remainingGenerations: number;
    expiresAt: string;
  };
  versions: Array<{
    id: string;
    versionNo: number;
    createdAt: string;
  }>;
};

export type GenerateDocumentPayload = {
  sourceType?: DocumentSourceType;
  sourceDocumentVersionId?: string;
  inputJson?: Record<string, unknown>;
  generationMode?: "standard" | "simple" | "custom";
  selectedSheets?: string[];
  testViewpoints?: string[];
  quality?: "standard" | "high";
};

export type DocumentVersionResult = {
  document: DocumentSummary;
  id: string;
  versionNo: number;
  createdAt: string;
  tabs: Record<string, Array<Record<string, unknown>>>;
  downloadUrl: string;
  grant?: DocumentSummary["grant"];
};
