import { ImageSlot } from "./products";

export interface SiteSettingsItem {
  id: number;
  brandName: string;
  brandLogoSrc: string;
  brandLogoAlt: string;
  mainBackgroundSrc: string;
  galleryBackgroundSrc: string;
  address: string;
  phone: string;
  email: string;
  businessHours: string;
  mapTitle: string;
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
  imageSliderUrl: string[]; // DB에 저장된 URL 배열 (업로드 후 URL로 변환되어 저장)

  
  imageSlider?: ImageSlot[]; // 프론트엔드에서 이미지 업로드 및 미리보기를 위해 사용하는 필드 (DB에는 저장되지 않음)
  tempFile?: File; // 미리보기용 임시 필드
  previewUrl?: string; // 로고 미리보기용 임시 필드
  mainBgTempFile?: File; // 메인 배경 미리보기용 임시 필드
  mainBgPreviewUrl?: string; // 메인 배경 미리보기용 임시 필드
  galleryBgTempFile?: File; // 갤러리 배경 미리보기용 임시 필드
  galleryBgPreviewUrl?: string; // 갤러리 배경 미리보기용 임시 필드
}
