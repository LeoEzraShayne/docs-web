import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { AnalyticsConsent } from "@/components/analytics-consent";
import { homeDescription, homeTitle, siteName, siteUrl } from "@/lib/seo";

const noto = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: homeTitle,
    template: `%s | ${siteName}`,
  },
  description: homeDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: "/",
    siteName,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: homeTitle,
    description: homeDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={noto.variable}>
        <AuthProvider>
          <div className="app-shell">
            <SiteHeader />
            <main className="page-shell">{children}</main>
            <Footer />
            <AnalyticsConsent />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
