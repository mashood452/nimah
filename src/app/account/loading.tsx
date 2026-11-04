"use client";

import { usePathname } from "next/navigation";
import { AuthSkeleton, DashboardSkeleton } from "@/components/account/AccountSkeleton";

/**
 * Shown the moment a visitor opens any account page, while the server checks the session. Without it the page area
 * stays empty for that time, so the footer jumps up under the navigation until the form arrives.
 * Log in and sign up show their real frame with placeholder fields; the customer area shows its dashboard shape.
 */
export default function Loading() {
  const pathname = usePathname();
  if (pathname.startsWith("/account/login")) return <AuthSkeleton />;
  if (pathname.startsWith("/account/signup")) return <AuthSkeleton signup />;
  return <DashboardSkeleton />;
}
