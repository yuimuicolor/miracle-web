import { supabase } from '@/lib/supabase';

export interface ImageSlot {
  id: string; // 로컬 프리뷰 및 DnD를 위한 고유 키
  file?: File; // 새로 업로드할 파일
  url?: string; // 기존 DB에 저장된 URL
  displayOrder?: number; // 이미지 순서 관리용 (옵션)
}

export interface ProductItem {
  id: number;
  subTitle: string;
  mainTitle: string;
  desc: string;
  category: string;
  options: string[];
  image: string; // 메인 이미지 슬롯 (최대 1개) - 기존 URL 또는 새 파일 둘 다 허용

  thumbnailImages: ImageSlot[];
  detailImages: ImageSlot[];

  purchaseLink: string;
  isVisible: boolean;
  displayOrder: number;
  
  // 관리자 전용 데이터
  tempMainFile?: File; // 메인 이미지로 새로 업로드할 파일
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