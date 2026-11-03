import { LegalDocument, legalMetadata } from "@/components/page/LegalDocument";
import { shipping } from "@/lib/legal/shipping";

export const metadata = legalMetadata(shipping);

export default function Page() {
  return <LegalDocument doc={shipping} />;
}
