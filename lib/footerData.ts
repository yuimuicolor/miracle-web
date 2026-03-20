import { SiteSettings } from "@/lib/siteSettings";

export interface FooterItem {
  label: string;
  value: string;
}

export interface FooterData {
  items: FooterItem[];
}

export const getFooterData = (settings: SiteSettings): FooterData => {
  return {
    items: [
      { label: "대표이사", value: settings.ownerName },
      { label: "사업자등록번호", value: settings.businessRegistrationNumber },
      { label: "주소", value: settings.address },
      { label: "전화", value: settings.phone },
      { label: "메일", value: settings.email },
    ],
  };
};

// 데스크탑/태블릿에서는 5개 항목을 3줄로 나눠서 보여주기 위한 인덱스 배열
const DESKTOP_ROW_INDEXES = [[0, 1], [2], [3, 4]] as const;

export const getDesktopRows = (items: FooterItem[]) => {
  return DESKTOP_ROW_INDEXES.map((row) =>
    row.map((index) => items[index]).filter(Boolean),
  );
};