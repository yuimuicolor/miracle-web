import { supabase } from '@/lib/supabase';
import { ProductItem } from '../types/products';

export const getProductById = async (id: number): Promise<ProductItem | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    subTitle: data.subTitle || "",
    mainTitle: data.mainTitle || "",
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
    .order('displayOrder', { ascending: true });

 if (error || !data) return [];
  
return data.map(item => ({
    id: item.id,
    subTitle: item.subTitle || "",
    mainTitle: item.mainTitle || "",
    desc: item.desc|| "",
    category: item.category || "",
    options: item.options || [],
    image: item.image || { id: "", url: "" },
    thumbnailImages: item.thumbnailImages || [],
    detailImages: item.detailImages || [],
    purchaseLink: item.purchaseLink || "",
    isVisible: item.isVisible ?? true,
    displayOrder: item.displayOrder ?? 0,
  }));
};