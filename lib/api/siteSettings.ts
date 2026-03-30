
import { SiteSettingsItem } from "../types/siteSettings";


export const getSiteSettings = async (): Promise<SiteSettingsItem | null> => {
  const res = await fetch("/api/siteSettings", { cache: "no-store" });

  if (!res.ok) return null;
  return res.json();
};

export const getSiteSettingsByServer = async (supabaseClient: any): Promise<SiteSettingsItem | null> => {
  const { data, error } = await supabaseClient
    .from("siteSettings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) return null;
  return {
    ...data,
    image: data.image || null,
  };
}


// 관리자 페이지에서 업데이트할 때 쓸 함수
export const updateSiteSettings = async (newData: Partial<SiteSettingsItem>) => {
  const res = await fetch("/api/siteSettings", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "사이트 설정 수정에 실패했습니다.");
  }
  return res.json();
};
