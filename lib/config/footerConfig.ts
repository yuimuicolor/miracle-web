import { FooterItem } from "../types/footer";
import { SiteSettingsItem } from "../types/siteSettings";

export const getFooterItems = (settings: SiteSettingsItem): FooterItem[] => {
  return [
    { label: "대표이사", value: settings.ownerName },
    { label: "사업자등록번호", value: settings.businessRegistrationNumber },
    { label: "주소", value: settings.address },
    { label: "전화", value: settings.phone },
    { label: "메일", value: settings.email },
  ];
};

const DESKTOP_ROW_INDEXES = [[0, 1], [2], [3, 4]] as const;

export const getDesktopRows = (items: FooterItem[]) => {
  return DESKTOP_ROW_INDEXES.map((row) =>
    row.map((index) => items[index]).filter(Boolean),
  );
};