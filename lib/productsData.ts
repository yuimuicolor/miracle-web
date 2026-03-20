import { supabase } from '@/lib/supabase';
// 1. 타입은 그대로 유지
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

// 2. ID 변환 로직들도 '유틸리티'로 그대로 유지 
export const PRODUCT_ID_REGEX = /^product-(\d+)$/;

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

export const getProductByPathId = async (pathId: string): Promise<ProductItem | null> => {
  const normalizedId = fromProductPathId(pathId);

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', normalizedId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    brandEn: data.brandEn || "",
    brandKo: data.brandKo || "",
    desc: data.desc || data.description || "",
    category: data.category || "",
    options: data.options || [],
    image: data.image || "",
    thumbnailImages: data.thumbnailImages || [],
    detailImages: data.detailImages || [],
    purchaseLink: data.purchaseLink || "",
  };
};

// 상품 리스트 로딩
export const getAllProducts = async (): Promise<ProductItem[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  if (error) return [];
  if (!data) return [];
  
return data.map(item => ({
    id: item.id,
    brandEn: item.brandEn || "",
    brandKo: item.brandKo || "",
    desc: item.desc|| "",
    category: item.category || "",
    options: item.options || [],
    image: item.image || "",
    thumbnailImages: item.thumbnailImages || [],
    detailImages: item.detailImages || [],
    purchaseLink: item.purchaseLink || "",
  }));
};