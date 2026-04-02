import { NavigationMenuItem } from "../types/header";

export const SITE_METADATA = {
  title: "Miracle",
  description: "miracle web demo site",
} as const;

export const NAVIGATION_MENU: NavigationMenuItem[] = [
  {
    title: "ABOUT US",
    href: "/aboutus#company",
    submenus: [
      { label: "회사소개", href: "/aboutus#company" },
      { label: "히스토리", href: "/aboutus#history" },
      { label: "인증서", href: "/aboutus#certificates" },
      { label: "CEO소개", href: "/aboutus#ceo" },
    ],
  },
  {
    title: "PRODUCTS",
    href: "/products",
    submenus: [{ label: "전체제품", href: "/products" }],
  },
  {
    title: "GALLERY",
    href: "/gallery",
    submenus: [],
  },
  {
    title: "CONTACT",
    href: "/contact#information",
    submenus: [
      { label: "INFORMATION", href: "/contact#information" },
      { label: "CONTACT US", href: "/contact#contact-us" },
    ],
  },
];

export const STATIC_ASSETS = {
  // 정보 섹션 아이콘
  info: {
    location: "/images/icon/icon_location.png",
    phone: "/images/icon/icon_phone.png",
    email: "/images/icon/icon_round-mail.png",
  },

  // SNS 아이콘 (Base & Hover 세트)
  sns: {
    instagram: {
      base: "/images/icon/icon-sns-instagram.png",
      hover: "/images/icon/icon-sns-instagram-hover.png",
    },
    x: {
      base: "/images/icon/icon-sns-x.png",
      hover: "/images/icon/icon-sns-x-hover.png",
    },
    youtube: {
      base: "/images/icon/icon-sns-youtube.png",
      hover: "/images/icon/icon-sns-youtube-hover.png",
    },
  },
} as const;
