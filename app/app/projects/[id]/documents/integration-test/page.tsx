import { DocumentGenerationPage } from "@/components/documents/document-generation-page";

export const runtime = "edge";

export default function IntegrationTestPage() {
  return <DocumentGenerationPage type="INTEGRATION_TEST" />;
}
