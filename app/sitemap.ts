import type { MetadataRoute } from "next";
import {
  absoluteUrl,
  blogRequirementsTemplate,
  landingPages,
} from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "/",
    "/pricing",
    "/demo",
    "/contact",
    ...landingPages.map((page) => page.slug),
    blogRequirementsTemplate.slug,
  ];

  return routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/pricing" ? 0.8 : 0.7,
  }));
}
