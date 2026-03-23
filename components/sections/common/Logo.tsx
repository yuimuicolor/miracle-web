"use client";

import { useSettings } from "@/context/SiteSettingsContext";

export default function Logo() {
  const settings = useSettings();

  return (
    <div className={`w-full`}>
      <img
        src={settings?.brandLogoSrc}
        alt={settings?.brandLogoAlt}
        loading="eager"
      />
    </div>
  );
}