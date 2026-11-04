import { ListingSkeleton } from "@/components/ui/Skeleton";

// This file sits in the (index) group so it covers only the listing page, never the style or collection pages
// below it, which must still be able to return a real 404.
export default function Loading() {
  return <ListingSkeleton />;
}
