import { LegalDocument, legalMetadata } from "@/components/page/LegalDocument";
import { privacy } from "@/lib/legal/privacy";

export const metadata = legalMetadata(privacy);

export default function Page() {
  return <LegalDocument doc={privacy} />;
}
