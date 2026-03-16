export interface FooterItem {
  label: string;
  value: string;
}

export interface FooterData {
  logoSrc: string;
  items: FooterItem[];
  policyText: string;
}

export const FOOTER_DATA: FooterData = {
  logoSrc: "/images/miracle-main-logo.png",
  items: [
    { label: "대표이사", value: "고재우" },
    { label: "사업자등록번호", value: "555-555-5555" },
    { label: "주소", value: "서울시 성동구 성수이로 123, 4F" },
    { label: "전화", value: "1555-5555" },
    { label: "메일", value: "miracle@miracle.com" },
  ],
  policyText: "개인정보처리방침",
};
