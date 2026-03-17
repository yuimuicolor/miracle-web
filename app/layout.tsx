import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TopButton from "@/components/TopButton";
import { HEADER_HEIGHTS_CSS } from "@/lib/headerConfig";

export const metadata: Metadata = {
  title: "Miracle",
  description: "miracle web demo site",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body
        style={{
          ["--header-height-mobile" as string]: HEADER_HEIGHTS_CSS.MOBILE,
          ["--header-height-tablet" as string]: HEADER_HEIGHTS_CSS.TABLET,
          ["--header-height-desktop" as string]: HEADER_HEIGHTS_CSS.PC,
          ["--header-extra-offset" as string]: HEADER_HEIGHTS_CSS.EXTRA_OFFSET,
        }}
      >
        <div className="site-shell">
          <Header />
          <div className="page-content">{children}</div>
          <Footer />
          <TopButton />
        </div>
      </body>
    </html>
  );
}