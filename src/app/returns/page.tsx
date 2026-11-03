import { LegalDocument, legalMetadata } from "@/components/page/LegalDocument";
import { returns } from "@/lib/legal/returns";

export const metadata = legalMetadata(returns);

export default function Page() {
  return <LegalDocument doc={returns} />;
}
