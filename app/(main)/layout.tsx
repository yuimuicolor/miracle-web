import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HEADER_HEIGHTS_CSS } from "@/lib/config/headerConfig";
import { SITE_METADATA } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: SITE_METADATA.title,
  description: SITE_METADATA.description,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
      <div
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
          </div>
      </div>
  );
}
