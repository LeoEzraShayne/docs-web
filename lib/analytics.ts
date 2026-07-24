export const analyticsConsentKey = "docs-analytics-consent";
export const analyticsConsentChangeEvent = "docs-analytics-consent-change";
export type AnalyticsConsentValue = "accepted" | "declined" | null;

export function readAnalyticsConsent(): AnalyticsConsentValue {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(analyticsConsentKey);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

export function setAnalyticsConsent(value: Exclude<AnalyticsConsentValue, null>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(analyticsConsentKey, value);
  } catch {
    // A blocked localStorage must not prevent the site from being used.
  }
  window.dispatchEvent(new Event(analyticsConsentChangeEvent));
}

export function disableAnalytics() {
  if (typeof window === "undefined") return;
  setAnalyticsConsent("declined");
  document
    .querySelectorAll<HTMLScriptElement>(
      'script[src*="googletagmanager.com/gtag/js"], script#docs-ga4',
    )
    .forEach((script) => script.remove());
  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[0])
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));
  const hostnameParts = window.location.hostname.split(".");
  const domains = [
    "",
    ...hostnameParts.slice(0, -1).map((_, index) =>
      `; domain=.${hostnameParts.slice(index).join(".")}`,
    ),
  ];
  for (const name of cookieNames) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax`;
    }
  }
  window.gtag = undefined;
  window.dataLayer = [];
}

export type AnalyticsEventName =
  | "template_download"
  | "sample_download"
  | "checklist_copy"
  | "checklist_export"
  | "seo_demo_click"
  | "seo_signup_click"
  | "seo_pricing_click"
  | "project_create"
  | "document_generate_start"
  | "document_generate_success"
  | "checkout_start"
  | "purchase_success"
  | "generated_excel_download";

export type AnalyticsEventParams = {
  pagePath: string;
  ctaPosition?: string;
  assetName?: string;
  documentType?: string;
  generationMode?: string;
  planType?: string;
};

export function trackAnalyticsEvent(
  eventName: AnalyticsEventName,
  parameters: AnalyticsEventParams,
) {
  if (
    typeof window === "undefined" ||
    !process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    readAnalyticsConsent() !== "accepted" ||
    !window.gtag
  ) return;
  window.gtag("event", eventName, {
    page_path: parameters.pagePath,
    ...(parameters.ctaPosition ? { cta_position: parameters.ctaPosition } : {}),
    ...(parameters.assetName ? { asset_name: parameters.assetName } : {}),
    ...(parameters.documentType
      ? { document_type: parameters.documentType }
      : {}),
    ...(parameters.generationMode
      ? { generation_mode: parameters.generationMode }
      : {}),
    ...(parameters.planType ? { plan_type: parameters.planType } : {}),
  });
}

export const trackSeoEvent = trackAnalyticsEvent;
export type SeoEventName = AnalyticsEventName;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
