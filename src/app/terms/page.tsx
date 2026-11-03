import { LegalDocument, legalMetadata } from "@/components/page/LegalDocument";
import { terms } from "@/lib/legal/terms";

export const metadata = legalMetadata(terms);

export default function Page() {
  return <LegalDocument doc={terms} />;
}
