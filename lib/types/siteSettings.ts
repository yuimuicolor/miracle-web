export interface SiteSettingsItem {
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

  
  tempFile?: File; // 미리보기용 임시 필드  
  previewUrl?: string; // 미리보기용 임시 필드
}