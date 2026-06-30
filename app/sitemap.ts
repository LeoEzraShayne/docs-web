import type { MetadataRoute } from "next";
import {
  absoluteUrl,
  landingPages,
  meetingNotesToRequirementsPage,
  requirementsDefinitionTemplatePage,
} from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "/",
    "/pricing",
    "/demo",
    "/contact",
    requirementsDefinitionTemplatePage.slug,
    meetingNotesToRequirementsPage.slug,
    ...landingPages.map((page) => page.slug),
  ];

  return routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/pricing" ? 0.8 : 0.7,
  }));
}
