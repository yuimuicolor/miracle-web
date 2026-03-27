
import TopButton from "@/components/TopButton";
import "./globals.css";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { getSiteSettings } from "@/lib/api/siteSettings";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <html lang="ko">
      <SiteSettingsProvider settings={settings}>
        <body className="antialiased">
          {children}
          <TopButton />
        </body>
      </SiteSettingsProvider>
    </html>
  );
}