import { useState, useEffect } from "react";
import { SiteSettingsItem } from "@/lib/types/siteSettings";
import { getSiteSettings, updateSiteSettings } from "@/lib/api/siteSettings";
import { uploadImage } from "@/lib/utils/storage";
import { supabase } from "@/lib/supabase/client";

export const useSiteSettingsManager = () => {
  const [settings, setSettings] = useState<SiteSettingsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 데이터 로드
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await getSiteSettings();
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  // 일반 필드 변경
  const handleChange = (field: keyof SiteSettingsItem, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  // SNS 설정 변경
  const handleSNSChange = (platform: string, field: "href" | "label", value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      snsConfig: {
        ...settings.snsConfig,
        [platform]: { ...settings.snsConfig[platform], [field]: value },
      },
    });
  };

  // 로고 업로드
  const handleLogoUpload = async (file: File) => {
    if (!settings) return;
    try {
      const publicUrl = await uploadImage(supabase, file, "site", `logo-${crypto.randomUUID()}.webp`, {
        maxWidthOrHeight: 1000,
        maxSizeMB: 1
      });
      setSettings({ ...settings, brandLogoSrc: publicUrl });
      return publicUrl;
    } catch (err) {
      throw new Error("로고 업로드 실패");
    }
  };

  // 전체 저장
  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await updateSiteSettings(settings);
      alert("✅ 사이트 설정이 저장되었습니다.");
    } catch (error) {
      alert("❌ 저장 실패");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings, loading, isSaving,
    handleChange, handleSNSChange, handleLogoUpload, handleSave
  };
};