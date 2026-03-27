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
}