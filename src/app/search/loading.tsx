import { ListingSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return <ListingSkeleton chips={false} count={4} />;
}
