import { LegalDocument, legalMetadata } from "@/components/page/LegalDocument";
import { cookies } from "@/lib/legal/cookies";

export const metadata = legalMetadata(cookies);

export default function Page() {
  return <LegalDocument doc={cookies} />;
}
