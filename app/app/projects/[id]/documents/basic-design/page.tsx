import { DocumentGenerationPage } from "@/components/documents/document-generation-page";

export const runtime = "edge";

export default function BasicDesignPage() {
  return <DocumentGenerationPage type="BASIC_DESIGN" />;
}
