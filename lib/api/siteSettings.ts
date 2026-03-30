// lib/api/siteSettings.ts
import { SiteSettingsItem } from "@/lib/types/siteSettings";

// 1. GET: 사이트 설정 불러오기 (ID: 1번 고정)
export const getSiteSettings = async (): Promise<SiteSettingsItem> => {
  const res = await fetch("/api/siteSettings", { cache: "no-store" });
  if (!res.ok) throw new Error("사이트 설정을 불러오지 못했습니다.");
  return res.json();
};

export const getSiteSettingsByServer  = async (supabaseClient: any): Promise<SiteSettingsItem> => {
  const {data, error} = await supabaseClient.from("siteSettings").select("*").eq("id", 1).single();
  if (error || !data) throw new Error("사이트 설정을 불러오지 못했습니다.");
  return data;
}

// 2. PATCH: 사이트 설정 업데이트
export const updateSiteSettings = async (settings: SiteSettingsItem) => {
  const res = await fetch("/api/siteSettings", {
    method: "PATCH", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("설정 저장에 실패했습니다.");
  return res.json();
};