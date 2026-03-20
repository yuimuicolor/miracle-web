import type { ContactData } from "@/types/contact";

export type ContactFieldName = keyof ContactData;

export interface NavigationSubmenuItem {
  label: string;
  href: string;
}

export interface NavigationMenuItem {
  title: string;
  href: string;
  submenus: NavigationSubmenuItem[];
}

export interface ContactFieldConfig {
  name: ContactFieldName;
  label: string;
  required?: boolean;
  type?: "text" | "email";
  inputType?: "input" | "textarea";
  rows?: number;
}

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
  // 로고 및 배경
  logo: "/images/miracle-main-logo.png",
  mainBg: "/images/main-bg.png",
  galleryBg: "/images/gallery-bg.png",

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

export const HOME_CONTENT = {
  mainSection: {
    title: {
      firstEmphasis: "기적",
      betweenText: "을 ",
      secondEmphasis: "일상",
      suffix: "으로,",
      star: "*",
    },
    logoText: "Miracle",
    subtitle: "Begins Within",
    scrollGuide: "SCROLL\nDOWN",
  },
  aboutSection: {
    sectionTitle: "About Us",
    description:
      "MIRACLE은 남들과는 다른 상상력으로 당신의 일상에서 \n기적과 같은 변화를 함께 만들어 가는 친구가 되기를 꿈꿉니다.",
    moreButtonText: "MORE",
  },
  productsSection: {
    sectionTitle: "Products",
    description: "이 자랑하는 대표 제품들을 소개합니다.",
    previousAriaLabel: "이전 제품 보기",
    nextAriaLabel: "다음 제품 보기",
    moreButtonText: "전체보기",
  },
  gallerySection: {
    sectionTitle: "Gallery",
    moreButtonText: "전체보기",
  },
  contactSection: {
    title: "CONTACT US",
    titleStar: "*",
    submitButtonText: "제출",
    consentText: "(필수) 아래 개인정보 이용 정책에 동의합니다.",
    consentLinkLabel: "[전문보기]",
    fields: [
      { name: "name", label: "이름", required: true },
      { name: "phone", label: "연락처", required: true },
      { name: "email", label: "이메일", required: true, type: "email" },
      { name: "company", label: "회사명" },
      {
        name: "message",
        label: "내용",
        required: true,
        inputType: "textarea",
        rows: 4,
      },
    ] satisfies ContactFieldConfig[],
  },
} as const;
