import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/account/AuthLayout";
import { AuthForm } from "@/components/account/AuthForm";
import { getCustomer } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Create an Account", description: "Create your personal Nimah Opticals account.", robots: { index: false, follow: true } };

export default async function SignupPage() {
  if (await getCustomer()) redirect("/account");
  return <AuthLayout signup><AuthForm mode="signup" /></AuthLayout>;
}
