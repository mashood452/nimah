import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./Account.module.css";

export function AuthLayout({ signup, children }: { signup?: boolean; children: ReactNode }) {
  return <main className={styles.authPage}>
    <div className={styles.authGrid}>
      <aside className={styles.story}>
        <Image src="/images/menu/sunglasses.webp" alt="Sunglasses styled for a sunlit day" fill priority sizes="(max-width: 900px) 100vw, 50vw" />
        <div className={styles.storyContent}><span className={styles.eyebrow}>A clearer perspective</span><h2>Good to see you.</h2><p>Thoughtfully chosen eyewear.<br />A little more personal.</p><Link href="/shop">Explore the collection <span aria-hidden="true">↗</span></Link></div>
      </aside>
      <section className={styles.formPanel} aria-labelledby="auth-title">
        <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>{signup ? "Create account" : "Log in"}</span></nav>
        <p className={styles.eyebrow}>Your Nimah account</p>
        <h1 id="auth-title">{signup ? "Make yourself at home." : "Welcome back."}</h1>
        <p className={styles.intro}>{signup ? "Create your account to keep your details and order history together." : "Log in to view your account and feel right at home."}</p>
        {children}
      </section>
    </div>
  </main>;
}
