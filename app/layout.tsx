import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";

const noto = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Docs | 要件定義をすぐ形にする",
  description: "議事録や背景情報から要件定義のプレビューと Excel を生成する Web SaaS",
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
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
