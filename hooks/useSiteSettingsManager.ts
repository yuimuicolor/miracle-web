import { useState, useEffect } from "react";
import { SiteSettingsItem } from "@/lib/types/siteSettings";
import { getSiteSettings, updateSiteSettings } from "@/lib/api/siteSettings";
import { cleanupStorageFiles } from "@/lib/api/common";
import {
  formatPhoneNumber,
  getFileNameFromUrl,
  uploadImage,
} from "@/lib/utils/storage";
import { supabase } from "@/lib/supabase/client";
import { DropResult } from "@hello-pangea/dnd";
import { ImageSlot } from "@/lib/types/products";
export const useSiteSettingsManager = () => {
  const [items, setItems] = useState<SiteSettingsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. 데이터 가져오기
  const fetchSettings = async () => {
    setLoading(true);
    const data = await getSiteSettings();

    if (data) {
      const formattedImageSlider =
        data.imageSliderUrl?.map((item: string | ImageSlot) => {
          if (typeof item === "string") {
            return { id: crypto.randomUUID(), url: item };
          }
          return item;
        }) || [];

      setItems({ ...data, imageSlider: formattedImageSlider });
    }
    setLoading(false);
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
  const handleReplaceImage = (
    file: File,
    type: "logo" | "mainBackground" | "galleryBackground" | "imageSlider",
  ) => {
    const previewUrl = URL.createObjectURL(file);
    if (type === "logo") {
      setItems((prev) =>
        prev ? { ...prev, tempFile: file, previewUrl } : prev,
      );
    } else if (type === "mainBackground") {
      setItems((prev) =>
        prev
          ? { ...prev, mainBgTempFile: file, mainBgPreviewUrl: previewUrl }
          : prev,
      );
    } else if (type === "galleryBackground") {
      setItems((prev) =>
        prev
          ? {
              ...prev,
              galleryBgTempFile: file,
              galleryBgPreviewUrl: previewUrl,
            }
          : prev,
      );
    }
  };

  // 5. 이미지 슬라이더 리스트 이미지 순서 변경
  const reorderImageList = (result: DropResult) => {
    // 1. 드롭 대상이 없으면 종료
    if (!result.destination) return;

    // 2. 해당 상품의 기존 이미지 리스트 복사
    const list = Array.from(items?.imageSlider || []);

    // 3. 배열 내 위치 이동
    const [moved] = list.splice(result.source.index, 1);
    list.splice(result.destination.index, 0, moved);

    // 4. 새로운 순서에 맞춰 displayOrder 부여 (1부터 시작)
    const updatedList = list.map((slot, idx) => ({
      ...slot,
      displayOrder: idx + 1,
    }));

    // 5. 전체 상품 상태 업데이트
    setItems((prev) => (prev ? { ...prev, imageSlider: updatedList } : prev));
  };

  // 6. 리스트 이미지 추가 (ID 생성 포함)
  const handleListUpload = (files: File[]) => {
    const newSlots: ImageSlot[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
    }));
    setItems((prev) =>
      prev
        ? { ...prev, imageSlider: [...(prev.imageSlider || []), ...newSlots] }
        : prev,
    );
  };

  // 7. 리스트 이미지 삭제
  const handleRemoveImage = (id: string) => {
    setItems((prev) =>
      prev
        ? {
            ...prev,
            imageSlider: (prev.imageSlider || []).filter(
              (img) => img.id !== id,
            ),
          }
        : prev,
    );
  };

  // 메인 이미지 슬라이더 리스트형 이미지 처리
  const processImageList = async (supabaseClient: any, list: ImageSlot[]) => {
    const uploadPromises = list.map(async (slot) => {
      if (slot.file) {
        const uniqueName = `${crypto.randomUUID()}_${Date.now()}.webp`;
        const targetPath = `slider/${uniqueName}`;
        return await uploadImage(
          supabaseClient,
          slot.file,
          "aboutUs",
          targetPath,
          {
            maxSizeMB: 2,
            maxWidthOrHeight: 2000,
            fileType: "image/webp",
          },
        );
      }
      return slot.url || null;
    });

    const finalUrls = (await Promise.all(uploadPromises)).filter(
      (url): url is string => !!url,
    );
    const activeFileNames = finalUrls.map((url) => getFileNameFromUrl(url));

    await cleanupStorageFiles(
      supabaseClient,
      "aboutUs",
      `slider`,
      activeFileNames,
    );
    return finalUrls;
  };

  // 전체 저장
  const handleSave = async () => {
    if (!items) return;

    setIsSaving(true);
    try {
      const finalImageSliderUrl = await processImageList(
        supabase,
        items.imageSlider || [],
      );

      let finalImageUrl = items.brandLogoSrc;
      let finalMainBgUrl = items.mainBackgroundSrc;
      let finalGalleryBgUrl = items.galleryBackgroundSrc;

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
          { maxWidthOrHeight: 1000, maxSizeMB: 1 },
        );
      }

      if (items.mainBgTempFile) {
        const prefix = `main-bg-`;
        const newName = `${prefix}_${Date.now()}.webp`;
        await cleanupStorageFiles(
          supabase,
          "siteSettings",
          "",
          [newName],
          prefix,
        );
        finalMainBgUrl = await uploadImage(
          supabase,
          items.mainBgTempFile,
          "siteSettings",
          newName,
          { maxWidthOrHeight: 2000, maxSizeMB: 2 },
        );
      }

      if (items.galleryBgTempFile) {
        const prefix = `gallery-bg-`;
        const newName = `${prefix}_${Date.now()}.webp`;
        await cleanupStorageFiles(
          supabase,
          "siteSettings",
          "",
          [newName],
          prefix,
        );
        finalGalleryBgUrl = await uploadImage(
          supabase,
          items.galleryBgTempFile,
          "siteSettings",
          newName,
          { maxWidthOrHeight: 2000, maxSizeMB: 2 },
        );
      }

      const {
        tempFile,
        previewUrl,
        mainBgTempFile,
        mainBgPreviewUrl,
        galleryBgTempFile,
        galleryBgPreviewUrl,
        ...payload
      } = items;

      console.log("Final Image Slider URLs:", finalImageSliderUrl);


      await updateSiteSettings({
        ...payload,
        brandLogoSrc: finalImageUrl,
        mainBackgroundSrc: finalMainBgUrl,
        galleryBackgroundSrc: finalGalleryBgUrl,
        imageSliderUrl: finalImageSliderUrl,
      });
      
      alert("✅ 사이트 설정이 저장되었습니다.");

      setItems({
        ...payload,
        brandLogoSrc: finalImageUrl,
        mainBackgroundSrc: finalMainBgUrl,
        galleryBackgroundSrc: finalGalleryBgUrl,
        tempFile: undefined,
        previewUrl: undefined,
        mainBgTempFile: undefined,
        mainBgPreviewUrl: undefined,
        galleryBgTempFile: undefined,
        galleryBgPreviewUrl: undefined,
      });

      fetchSettings(); // 변경된 데이터 다시 불러오기
    } catch (error: any) {
      console.error(error);
      alert(`❌ 저장 실패: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    items: items
      ? {
          ...items,
          brandLogoSrc: items.previewUrl || items.brandLogoSrc,
          mainBackgroundSrc: items.mainBgPreviewUrl || items.mainBackgroundSrc,
          galleryBackgroundSrc:
            items.galleryBgPreviewUrl || items.galleryBackgroundSrc,
        }
      : null,
    loading,
    isSaving,
    handleChange,
    handleSNSChange,
    handleReplaceImage,
    reorderImageList,
    handleListUpload,
    handleRemoveImage,
    handleSave,
  };
};
