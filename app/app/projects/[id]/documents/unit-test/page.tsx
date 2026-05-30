import { DocumentGenerationPage } from "@/components/documents/document-generation-page";

export const runtime = "edge";

export default function UnitTestPage() {
  return <DocumentGenerationPage type="UNIT_TEST" />;
}
