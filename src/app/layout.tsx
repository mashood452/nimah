import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { connection } from "next/server";
import { preconnect, prefetchDNS } from "react-dom";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Footer } from "@/components/footer/Footer";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { RouteLoading } from "@/components/motion/RouteLoading";
import { Navbar } from "@/components/navbar/Navbar";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { ProductCatalogProvider } from "@/components/shop/ProductCatalogProvider";
import { getProducts } from "@/lib/catalog";
import { getCustomer } from "@/lib/auth/session";
import { CartSync } from "@/components/shop/CartSync";
import { startCartReminderWorker } from "@/lib/email/worker";
import { RecaptchaProvider } from "@/components/account/Recaptcha";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const ogImageAlt = `${siteConfig.name}: luxury sunglasses, blue-cut glasses and eyewear`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: siteConfig.url,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: ogImageAlt }],
  },
  twitter: { card: "summary_large_image", images: [{ url: siteConfig.ogImage, alt: ogImageAlt }] },
  robots: { index: true, follow: true },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

// The shared catalog provider is runtime-only. Allow the root to wait before sending a response.
export const instant = false;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Early connections for Google Analytics, so its script and first hit start sooner.
  preconnect("https://www.googletagmanager.com");
  prefetchDNS("https://www.google-analytics.com");
  await connection();
  startCartReminderWorker();
  const [products, customer] = await Promise.all([getProducts(), getCustomer()]);
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <RecaptchaProvider>
        <ProductCatalogProvider products={products}>
          <CartSync accountId={customer?.id ?? null} />
          <Navbar accountName={customer?.name} />
          <CartDrawer />
          <RouteLoading />
          <span id="main" tabIndex={-1} />
          {children}
          <Footer />
          <RevealOnScroll />
          <GoogleAnalytics />
        </ProductCatalogProvider>
        </RecaptchaProvider>
      </body>
    </html>
  );
}
