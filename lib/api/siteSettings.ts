import { supabase } from "@/lib/supabase";
import { SiteSettingsItem } from "../types/siteSettings";


export const getSiteSettings = async (): Promise<SiteSettingsItem | null> => {
  const { data, error } = await supabase
    .from("siteSettings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    snsConfig: data.snsConfig || {
      instagram: { href: "", label: "instagram" },
      youtube: { href: "", label: "youtube" },
      x: { href: "", label: "x" },
    },
  };
};

// 관리자 페이지에서 업데이트할 때 쓸 함수
export const updateSiteSettings = async (newData: Partial<SiteSettingsItem>) => {
  const { data, error } = await supabase
    .from("siteSettings")
    .update(newData)
    .eq("id", 1)
    .select()
    .single();

  if (error) throw error;
  return data;
};
