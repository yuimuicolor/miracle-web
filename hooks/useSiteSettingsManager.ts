import { useState, useEffect } from "react";
import { SiteSettingsItem } from "@/lib/types/siteSettings";
import { getSiteSettings, updateSiteSettings } from "@/lib/api/siteSettings";
import { cleanupStorageFiles } from "@/lib/api/common";
import { formatPhoneNumber, uploadImage } from "@/lib/utils/storage";
import { supabase } from "@/lib/supabase/client";

export const useSiteSettingsManager = () => {
  const [items, setItems] = useState<SiteSettingsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 데이터 로드
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await getSiteSettings();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

// 일반 필드 변경 핸들러
  const handleChange = (field: keyof SiteSettingsItem, value: any) => {
    if (!items) return;

    let finalValue = value;

    // field가 'phone'일 때만 포맷팅 적용
    if (field === "phone") {
      finalValue = formatPhoneNumber(value);
    }

    setItems({ ...items, [field]: finalValue });
  };
  // SNS 설정 변경
  const handleSNSChange = (
    platform: string,
    field: "href" | "label",
    value: string,
  ) => {
    if (!items) return;
    setItems({
      ...items,
      snsConfig: {
        ...items.snsConfig,
        [platform]: { ...items.snsConfig[platform], [field]: value },
      },
    });
  };

  // 4. 이미지 교체 (미리보기)
  const handleReplaceImage = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setItems((prev) => (prev ? { ...prev, tempFile: file, previewUrl } : prev));
  };

  // 전체 저장
  const handleSave = async () => {
    if (!items) return;
    setIsSaving(true);
    try {
      let finalImageUrl = items.brandLogoSrc;
      if (items.tempFile) {
        const prefix = `site-logo-`; // 기존 파일명과 겹치는 부분
        const newName = `${prefix}_${Date.now()}.webp`;

        await cleanupStorageFiles(
          supabase,
          "siteSettings",
          "",
          [newName],
          prefix,
        ); // 기존 파일 청소
        finalImageUrl = await uploadImage(
          supabase,
          items.tempFile,
          "siteSettings",
          newName,
          { maxWidthOrHeight: 1000, maxSizeMB: 2 },
        );
      }
      const { tempFile, previewUrl, ...payload } = items;
      await updateSiteSettings({ ...payload, brandLogoSrc: finalImageUrl });
      alert("✅ 사이트 설정이 저장되었습니다.");

      setItems({ ...payload, brandLogoSrc: finalImageUrl, tempFile: undefined, previewUrl: undefined });
    } catch (error: any) {
      console.error(error);
      alert(`❌ 저장 실패: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return {
   items: items ? {
      ...items,
      brandLogoSrc: items.previewUrl || items.brandLogoSrc
    } : null,
    loading,
    isSaving,
    handleChange,
    handleSNSChange,
    handleReplaceImage,
    handleSave,
  };
};
