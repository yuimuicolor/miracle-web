
import TopButton from "@/components/TopButton";
import "./globals.css";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { getSiteSettingsByServer } from "@/lib/api/siteSettings";
import { supabaseServer } from "@/lib/supabase/server";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettingsByServer(supabaseServer);

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