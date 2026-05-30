import { DocumentGenerationPage } from "@/components/documents/document-generation-page";

export const runtime = "edge";

export default function DetailedDesignPage() {
  return <DocumentGenerationPage type="DETAILED_DESIGN" />;
}
