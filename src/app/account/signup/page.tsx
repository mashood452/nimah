import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/account/AuthLayout";
import { AuthForm } from "@/components/account/AuthForm";
import { getCustomer } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Create an Account", description: "Create your personal Nimah Opticals account.", robots: { index: false, follow: true } };

export default async function SignupPage({ searchParams }: PageProps<"/account/signup">) {
  const params = await searchParams;
  const destination = params.next === "/cart" || params.next === "/checkout" ? params.next : "/account";
  if (await getCustomer()) redirect(destination);
  return <AuthLayout signup><AuthForm mode="signup" destination={destination} /></AuthLayout>;
}
