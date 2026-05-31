import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/seo-landing-page";
import { landingPages, pageMetadata } from "@/lib/seo";

const page = landingPages.find((item) => item.slug === "/basic-design-ai")!;

export const metadata: Metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: page.slug,
});

export default function BasicDesignAiPage() {
  return <SeoLandingPage page={page} />;
}
