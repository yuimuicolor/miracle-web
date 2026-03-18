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

export const BRAND_DATA = {
  name: "Miracle",
  uppercaseName: "MIRACLE",
  logoSrc: "/images/miracle-main-logo.png",
  logoAlt: "Miracle",
} as const;

export const STORE_DATA = {
  businessName: "자연도소금빵 성수점",
  address: "대한민국 서울특별시 성동구 연무장길 56-1",
  phone: "010-2555-2555",
  email: "miracle@email.com",
  businessHours: "월-금 09시-18시 (공휴일/주말 휴무)",
  mapQuery: "자연도소금빵 성수점 대한민국 서울특별시 성동구 연무장길 56-1",
  mapLink:
    "https://www.google.com/maps/place/%EC%9E%90%EC%97%B0%EB%8F%84%EC%86%8C%EA%B8%88%EB%B9%B5+%EC%84%B1%EC%88%98%EC%A0%90/@37.5423025,127.0553657,21z/data=!4m6!3m5!1s0x357ca58daad46ea9:0x4922f006043fcb1e!8m2!3d37.5423017!4d127.0554582!16s%2Fg%2F11vctr0f09",
  ownerName: "고재우",
  businessRegistrationNumber: "555-555-5555",
  footerAddress: "서울시 성동구 성수이로 123, 4F",
  footerPhone: "1555-5555",
  footerEmail: "miracle@miracle.com",
  privacyPolicyText: "개인정보처리방침",
  infoIcons: {
    location: "/images/icon/icon_location.png",
    phone: "/images/icon/icon_phone.png",
    email: "/images/icon/icon_round-mail.png",
  },
  sns: {
    instagram: {
      href: "https://www.instagram.com/",
      label: "Instagram",
      iconSrc: "/images/icon/icon-sns-instagram.png",
      hoverIconSrc: "/images/icon/icon-sns-instagram-hover.png",
    },
    youtube: {
      href: "https://www.youtube.com/",
      label: "YouTube",
      iconSrc: "/images/icon/icon-sns-youtube.png",
      hoverIconSrc: "/images/icon/icon-sns-youtube-hover.png",
    },
    x: {
      href: "https://x.com/",
      label: "X",
      iconSrc: "/images/icon/icon-sns-x.png",
      hoverIconSrc: "/images/icon/icon-sns-x-hover.png",
    },
  },
} as const;

export const NAVIGATION_MENU: NavigationMenuItem[] = [
  {
    title: "ABOUT US",
    href: "/aboutus",
    submenus: [
      { label: "회사소개", href: "/aboutus/company" },
      { label: "히스토리", href: "/aboutus/history" },
      { label: "인증서", href: "/aboutus/certificates" },
      { label: "CEO소개", href: "/aboutus/ceo" },
    ],
  },
  {
    title: "PRODUCTS",
    href: "/products",
    submenus: [
      { label: "전체제품", href: "/products" },
    ],
  },
  {
    title: "GALLERY",
    href: "/gallery",
    submenus: [],
  },
  {
    title: "CONTACT",
    href: "/contact",
    submenus: [
      { label: "오시는길", href: "/contact/directions" },
      { label: "상담문의", href: "/contact/inquiry" },
    ],
  },
];

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
  informationSection: {
    sectionTitle: "INFORMATION",
    starsText: "***",
    mapTitle: "MIRACLE 위치 지도",
    businessHoursLabel: "영업시간",
    locationIconAlt: "위치",
    phoneIconAlt: "전화",
    emailIconAlt: "이메일",
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
      {
        name: "email",
        label: "이메일",
        required: true,
        type: "email",
      },
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
