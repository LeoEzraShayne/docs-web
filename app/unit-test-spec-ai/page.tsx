import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/seo-landing-page";
import { landingPages, pageMetadata } from "@/lib/seo";

const page = landingPages.find((item) => item.slug === "/unit-test-spec-ai")!;

export const metadata: Metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: page.slug,
});

export default function UnitTestSpecAiPage() {
  return <SeoLandingPage page={page} />;
}
