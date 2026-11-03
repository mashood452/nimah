import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { connection } from "next/server";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Footer } from "@/components/footer/Footer";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Navbar } from "@/components/navbar/Navbar";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { ProductCatalogProvider } from "@/components/shop/ProductCatalogProvider";
import { getProducts } from "@/lib/catalog";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

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
    images: [siteConfig.ogImage],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

// The shared catalog provider is runtime-only. Allow the root to wait before sending a response.
export const instant = false;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  await connection();
  const products = await getProducts();
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        <ProductCatalogProvider products={products}>
          <Navbar />
          <CartDrawer />
          {children}
          <Footer />
          <RevealOnScroll />
          <GoogleAnalytics />
        </ProductCatalogProvider>
      </body>
    </html>
  );
}
