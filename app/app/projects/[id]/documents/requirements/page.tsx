import { DocumentGenerationPage } from "@/components/documents/document-generation-page";

export const runtime = "edge";

export default function RequirementsPage() {
  return <DocumentGenerationPage type="REQUIREMENTS" />;
}
