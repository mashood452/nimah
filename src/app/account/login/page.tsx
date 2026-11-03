import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/account/AuthLayout";
import { AuthForm } from "@/components/account/AuthForm";
import { getCustomer } from "@/lib/auth/session";
import styles from "@/components/account/Account.module.css";

export const metadata: Metadata = { title: "Log In", description: "Welcome back to your Nimah Opticals account.", robots: { index: false, follow: true } };

export default async function LoginPage({ searchParams }: PageProps<"/account/login">) {
  if (await getCustomer()) redirect("/account");
  const params = await searchParams;
  return <AuthLayout>
    {params.signedOut === "1" && <p className={styles.success} role="status">You have been logged out safely. See you again soon.</p>}
    <AuthForm mode="login" />
  </AuthLayout>;
}
