import { supabase } from "@/lib/supabase";

export interface SiteSettings {
  id: number;
  brandName: string;
  brandUppercaseName: string;
  brandLogoSrc: string;
  brandLogoAlt: string;
  businessName: string;
  address: string;
  phone: string;
  email: string;
  businessHours: string;
  mapQuery: string;
  mapLink: string;
  ownerName: string;
  businessRegistrationNumber: string;
  privacyPolicyText: string;
  snsConfig: {
    [key: string]: {
      href: string;
      label: string;
    };
  };
}
export const getSiteSettings = async (): Promise<SiteSettings | null> => {
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
export const updateSiteSettings = async (newData: Partial<SiteSettings>) => {
  const { data, error } = await supabase
    .from("siteSettings")
    .update(newData)
    .eq("id", 1)
    .select()
    .single();

  if (error) throw error;
  return data;
};
