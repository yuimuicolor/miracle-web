import { BRAND_DATA, STORE_DATA } from "@/lib/siteData";

export interface FooterItem {
  label: string;
  value: string;
}

export interface FooterData {
  items: FooterItem[];
  policyText: string;
}

export const FOOTER_DATA: FooterData = {
  items: [
    { label: "대표이사", value: STORE_DATA.ownerName },
    { label: "사업자등록번호", value: STORE_DATA.businessRegistrationNumber },
    { label: "주소", value: STORE_DATA.footerAddress },
    { label: "전화", value: STORE_DATA.footerPhone },
    { label: "메일", value: STORE_DATA.footerEmail },
  ],
  policyText: STORE_DATA.privacyPolicyText,
};
