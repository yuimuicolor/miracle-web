export interface AboutIntroRow {
  title: string;
  accent: string;
  body: string;
  imageClass: string;
  reverse: boolean;
}

export interface AboutHistoryItem {
  year: string;
  date: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
}

export interface CertificateItem {
  id: number;
  title: string;
  desc: string;
}

export const ABOUT_PAGE_CONTENT = {
  pageTitle: "ABOUT US",
  pageTitleStar: "*",
  introRows: [
    {
      title: "독창적인 발상 으로",
      accent: "일상에 기적 같은 변화 를.",
      body: "미라클은 브랜드의 본질을 깊게 해석하고, 감각적인 시각 언어로 재구성합니다.\n작은 차이가 큰 인상을 만든다는 믿음으로 한 장면씩 완성합니다.",
      imageClass: "rounded-full",
      reverse: false,
    },
    {
      title: "MING: 기적",
      accent: "보이지 않는 가치를 보이게.",
      body: "전략적 사고와 크리에이티브의 접점에서 고객의 문제를 해결합니다.\n단순히 예쁜 디자인을 넘어 성과를 만드는 브랜드 경험을 만듭니다.",
      imageClass: "rounded-[120px]",
      reverse: true,
    },
    {
      title: "고양이는 귀엽습니다",
      accent: "디테일은 결국 설득력이 됩니다.",
      body: "우리는 문장, 그리드, 여백, 타이포그래피 같은 기본 요소를 집요하게 다룹니다.\n브랜드가 오래 기억되도록 감정의 밀도를 디자인합니다.",
      imageClass: "rounded-[120px]",
      reverse: false,
    },
  ] satisfies AboutIntroRow[],
  trustText: "Trust Integrity Reliability Transformation",
  history: {
    headingEn: "HISTORY",
    headingKo: "히스토리",
    description: "미라클의 발자취를 연도별로 확인해보세요.",
    items: [
      {
        year: "2016",
        date: "04-05",
        title: "MIRACLE 창립",
        imageSrc: "/images/about-us/history-1.webp",
        imageAlt: "2016 MIRACLE 창립",
      },
      {
        year: "2017",
        date: "04-05",
        title: "MIRACLE.jp, 창립",
        imageSrc: "/images/about-us/history-2.webp",
        imageAlt: "2017 MIRACLE.jp 창립",
      },
      {
        year: "2018",
        date: "06-06",
        title: "MIRACLE global 활동",
        imageSrc: "/images/about-us/history-3.webp",
        imageAlt: "2018 MIRACLE global 활동",
      },
      {
        year: "2019",
        date: "11-16",
        title: "구직관리 1위 기업 달성",
        imageSrc: "/images/about-us/history-4.webp",
        imageAlt: "2019 구직관리 1위 기업 달성",
      },
      {
        year: "2022",
        date: "04-01",
        title: "가입자 1000명 보유",
        imageSrc: "/images/about-us/history-5.webp",
        imageAlt: "2022 가입자 1000명 보유",
      },
      {
        year: "2025",
        date: "11-11",
        title: "K 글로벌 대회 기업 수상",
        imageSrc: "/images/about-us/history-6.webp",
        imageAlt: "2025 K 글로벌 대회 기업 수상",
      },
      {
        year: "2026",
        date: "02-14",
        title: "브랜드 파트너십 50건 달성",
        imageSrc: "/images/about-us/history-1.webp",
        imageAlt: "2026 브랜드 파트너십 50건 달성",
      },
      {
        year: "2027",
        date: "07-21",
        title: "아시아 디자인 어워드 수상",
        imageSrc: "/images/about-us/history-2.webp",
        imageAlt: "2027 아시아 디자인 어워드 수상",
      },
      {
        year: "2028",
        date: "12-03",
        title: "글로벌 지사 3개국 확장",
        imageSrc: "/images/about-us/history-3.webp",
        imageAlt: "2028 글로벌 지사 3개국 확장",
      },
      {
        year: "2029",
        date: "03-18",
        title: "브랜드 캠페인 누적 100건 돌파",
        imageSrc: "/images/about-us/history-4.webp",
        imageAlt: "2029 브랜드 캠페인 누적 100건 돌파",
      },
      {
        year: "2030",
        date: "09-09",
        title: "글로벌 파트너 네트워크 확장",
        imageSrc: "/images/about-us/history-5.webp",
        imageAlt: "2030 글로벌 파트너 네트워크 확장",
      },
    ] satisfies AboutHistoryItem[],
  },
  certificates: {
    headingEn: "CERTIFICATE",
    headingKo: "인증서",
    description: "공식 인증 및 수상 내역입니다.",
    items: Array.from({ length: 10 }).map((_, index) => ({
      id: index + 1,
      title: `TITLE | ${index + 1}호`,
      desc: "브랜드 디자인 최우수상",
    })) satisfies CertificateItem[],
  },
  ceo: {
    label: "CHIEF EXECUTIVE OFFICER",
    title: "C.E.O",
    name: "김미라 / MIRA KIM",
    description:
      "브랜드 전략과 시각 설계를 연결하며,\n의미 있는 변화가 일어나는 디자인을 만듭니다.\nC.E.O로서 미라클의 방향성을 총괄합니다.",
    socialChannels: ["IG", "YT", "X"],
    imageAlt: "ceo",
  },
} as const;