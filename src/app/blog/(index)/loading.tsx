import { BlogSkeleton } from "@/components/ui/Skeleton";

// In the (index) group so it covers only the journal list, never the article pages (which can return a real 404).
export default function Loading() {
  return <BlogSkeleton />;
}
