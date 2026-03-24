import { supabase } from '@/lib/supabase';
// 1. 타입은 그대로 유지
export interface ProductItem {
  id: number;
  brandEn: string;
  brandKo: string;
  desc: string;
  category: string;
  options: string[];
  image: string;
  thumbnailImages: string[];
  detailImages: string[];
  purchaseLink: string;
  isVisible: boolean;
  displayOrder: number;

  isDeleted?: boolean;
  isNew?: boolean;
}

export const getProductById = async (id: number): Promise<ProductItem | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
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
    isVisible: data.isVisible ?? true,
    displayOrder: data.displayOrder ?? 0,

  };
};

// 상품 리스트 로딩
export const getAllProducts = async (): Promise<ProductItem[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

 if (error || !data) return [];
  
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
    isVisible: item.isVisible ?? true,
    displayOrder: item.displayOrder ?? 0,
  }));
};