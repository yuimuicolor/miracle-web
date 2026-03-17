export interface ProductItem {
  id: string;
  brandEn: string;
  brandKo: string;
  image: string;
  desc: string;
  category: string;
  options: string[];
  thumbnailImages: string[];
  detailImages: string[];
  purchaseLink: string;
}

export const PRODUCT_IMAGE_MIN_COUNT = 1;
export const PRODUCT_IMAGE_MAX_COUNT = 10;

const ensureImageCountInRange = (count: number, label: string) => {
  if (count < PRODUCT_IMAGE_MIN_COUNT || count > PRODUCT_IMAGE_MAX_COUNT) {
    throw new Error(
      `[productsData] ${label} count must be between ${PRODUCT_IMAGE_MIN_COUNT} and ${PRODUCT_IMAGE_MAX_COUNT}. Received: ${count}`,
    );
  }
};

const buildProductImages = (
  productId: string,
  group: "thumb" | "detail",
  count: number,
) => {
  ensureImageCountInRange(count, `${productId}/${group}`);

  return Array.from({ length: count }, (_, index) => {
    const seq = String(index + 1).padStart(2, "0");
    return `/images/products/${productId}/${group}/${seq}.webp`;
  });
};

const buildProductImageSet = (
  productId: string,
  thumbnailCount: number,
  detailCount: number,
) => ({
  image: `/images/products/${productId}/thumb/01.webp`,
  thumbnailImages: buildProductImages(productId, "thumb", thumbnailCount),
  detailImages: buildProductImages(productId, "detail", detailCount),
});

const PRODUCT_ID_REGEX = /^product-(\d+)$/;

export const toProductPathId = (id: string) => {
  const match = id.match(PRODUCT_ID_REGEX);
  if (!match) return id;
  return `product-${Number(match[1])}`;
};

export const fromProductPathId = (pathId: string) => {
  const match = pathId.match(PRODUCT_ID_REGEX);
  if (!match) return pathId;
  return `product-${match[1].padStart(2, "0")}`;
};

export const getProductByPathId = (pathId: string) => {
  const normalizedId = fromProductPathId(pathId);
  return PRODUCTS.find((product) => product.id === normalizedId) ?? null;
};

export const PRODUCTS: ProductItem[] = [
  {
    id: "product-01",
    brandEn: "MIRADERM",
    brandKo: "미라덤",
    desc: "미라덤은 민감한 피부를 위한 저자극 보습 밸런스를 완성하는 데일리 스킨케어 라인입니다.",
    category: "향수 / PERFUME",
    options: ["15ml / 29,000", "50ml / 50,000"],
    ...buildProductImageSet("product-01", 3, 3),
    purchaseLink: "https://naver.com",
  },
  {
    id: "product-02",
    brandEn: "AQUAVEIL",
    brandKo: "아쿠아베일",
    desc: "아쿠아베일은 수분 보호막을 촘촘히 형성해 건조한 환경에서도 촉촉함을 오래 유지해 줍니다.",
    category: "스킨케어 / MOISTURE",
    options: ["30ml / 33,000", "80ml / 58,000"],
    ...buildProductImageSet("product-02", 3, 2),
    purchaseLink: "https://naver.com",
  },
  {
    id: "product-03",
    brandEn: "LUMINOS",
    brandKo: "루미노스",
    desc: "루미노스는 맑고 균일한 피부 톤을 위한 브라이트닝 케어를 중심으로 설계된 제품입니다.",
    category: "스킨케어 / BRIGHTENING",
    options: ["20ml / 31,000"],
    ...buildProductImageSet("product-03", 3, 2),
    purchaseLink: "https://naver.com",
  },
  {
    id: "product-04",
    brandEn: "CERAVIVE",
    brandKo: "세라바이브",
    desc: "세라바이브는 피부 장벽 컨디션을 강화해 외부 자극으로부터 편안한 상태를 유지하도록 돕습니다.",
    category: "스킨케어 / BARRIER",
    options: ["40ml / 42,000", "90ml / 69,000"],
    ...buildProductImageSet("product-04", 3, 2),
    purchaseLink: "https://naver.com",
  },
  {
    id: "product-05",
    brandEn: "BIOREVE",
    brandKo: "바이오레브",
    desc: "바이오레브는 피부 본연의 활력을 깨워 탄탄한 인상을 완성하는 영양 집중 포뮬러를 담았습니다.",
    category: "영양케어 / NUTRITION",
    options: ["25ml / 34,000", "60ml / 57,000"],
    ...buildProductImageSet("product-05", 3, 2),
    purchaseLink: "https://naver.com",
  },
  {
    id: "product-06",
    brandEn: "SONNEVE",
    brandKo: "소네브",
    desc: "소네브는 자외선과 외부 환경으로부터 피부를 보호하며 일상 속 가벼운 사용감을 제공합니다.",
    category: "선케어 / UV SHIELD",
    options: ["50ml / 36,000"],
    ...buildProductImageSet("product-06", 3, 2),
    purchaseLink: "https://naver.com",
  },
  {
    id: "product-07",
    brandEn: "VELURIA",
    brandKo: "벨루리아",
    desc: "벨루리아는 부드러운 벨벳 텍스처로 피부 결을 정돈해 매끄러운 마무리감을 전달합니다.",
    category: "텍스처케어 / VELVET",
    options: ["30ml / 37,000", "70ml / 61,000"],
    ...buildProductImageSet("product-07", 3, 2),
    purchaseLink: "https://naver.com",
  },
  {
    id: "product-08",
    brandEn: "NUVADERM",
    brandKo: "누바덤",
    desc: "누바덤은 복합 피부 고민을 한 번에 케어할 수 있도록 균형 잡힌 성분 조합을 제안합니다.",
    category: "멀티케어 / ALL-IN-ONE",
    options: ["45ml / 39,000"],
    ...buildProductImageSet("product-08", 3, 2),
    purchaseLink: "https://naver.com",
  },
  {
    id: "product-09",
    brandEn: "PEARLUX",
    brandKo: "펄룩스",
    desc: "펄룩스는 은은한 광채와 보습을 함께 제공해 생기 있는 피부 표현을 돕는 데일리 케어입니다.",
    category: "글로우 / GLOW",
    options: ["20ml / 32,000", "55ml / 54,000"],
    ...buildProductImageSet("product-09", 3, 2),
    purchaseLink: "https://naver.com",
  },
  {
    id: "product-10",
    brandEn: "SILKARA",
    brandKo: "실카라",
    desc: "실카라는 실크처럼 가벼운 사용감으로 피부에 편안하게 밀착되어 자연스러운 윤기를 더합니다.",
    category: "피니시 / SILK FINISH",
    options: ["25ml / 35,000", "60ml / 59,000"],
    ...buildProductImageSet("product-10", 3, 2),
    purchaseLink: "https://naver.com",
  },
];
