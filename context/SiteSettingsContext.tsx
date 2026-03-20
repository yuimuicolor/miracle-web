"use client";

import { createContext, useContext, ReactNode } from "react";
import { SiteSettings } from "@/lib/siteSettings";

// 1. Context 생성
const SiteSettingsContext = createContext<SiteSettings | null>(null);

// 2. 공급자(Provider)
export function SiteSettingsProvider({ 
  children, 
  settings 
}: { 
  children: ReactNode; 
  settings: SiteSettings | null; 
}) {
  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

// 3. 커스텀 훅
export const useSettings = () => {
  const context = useContext(SiteSettingsContext);
  return context;
};