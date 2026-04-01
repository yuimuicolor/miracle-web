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

  
  tempFile?: File; // 미리보기용 임시 필드  
  previewUrl?: string; // 로고 미리보기용 임시 필드
  mainBgTempFile?: File; // 메인 배경 미리보기용 임시 필드
  mainBgPreviewUrl?: string; // 메인 배경 미리보기용 임시 필드
  galleryBgTempFile?: File; // 갤러리 배경 미리보기용 임시 필드
  galleryBgPreviewUrl?: string; // 갤러리 배경 미리보기용 임시 필드
}