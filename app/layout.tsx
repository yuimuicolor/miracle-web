import "./globals.css";
import TopButton from "@/components/TopButton";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { supabaseServer } from "@/lib/supabase/server";
import { getSiteSettingsByServer } from "@/lib/api/siteSettings";
import ReCaptchaProvider from "@/context/ReCaptchaProvider";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettingsByServer(supabaseServer);

  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <SiteSettingsProvider settings={settings}>
        <ReCaptchaProvider>
          <body className="antialiased">
            {children}
            <TopButton />
          </body>
          </ReCaptchaProvider>
      </SiteSettingsProvider>
    </html>
  );
}
