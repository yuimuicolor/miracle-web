import { getFileNameFromUrl, uploadImage } from "@/lib/utils/storage";
import { cleanupStorageFiles, ensureRecordId } from "@/lib/api/common";
import { ProductItem } from "../types/products";


export const getAllProducts = async () : Promise<ProductItem[]> => {
 const res = await fetch("/api/products", { cache: "no-store" });

 if (!res.ok) throw new Error("상품 데이터를 불러오는데 실패했습니다.");
 return res.json();
};

export const getProductById = async (id: number | string): Promise<ProductItem | null> => {
  const res = await fetch(`/api/products/${id}`, { cache: "no-store" });

  if (!res.ok) return null;
  const data = await res.json();

  return {
    ...data,
    image: data.image || null,
  };
};

export const getProductByIdServer = async (id: number | string, supabaseClient: any): Promise<ProductItem | null> => {
  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return {
    ...data,
    image: data.image || null,
  };
}

export const saveProductsAll = async (finalItems: any[], deletedIds: number[]) => {
  // 2. DB용 아이템 정리 (삭제 제외 + 필요한 필드만)
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ finalItems, deletedIds }),
  });

  if (!res.ok) throw new Error("상품 저장 실패!");
  return res.json();
};


// 리스트형 이미지(썸네일/상세) 처리
export const processImageList = async (supabaseClient: any, list: any[], type: string, folder: string) => {
  const uploadPromises = list.map(async (slot) => {
    if (slot.file) {
      const uniqueName = `${crypto.randomUUID()}_${Date.now()}.webp`;
      const targetPath = `${folder}/${type}/${uniqueName}`;
      return await uploadImage(supabaseClient, slot.file, "products", targetPath);
    }
    return slot.url || null;
  });

  const finalUrls = (await Promise.all(uploadPromises)).filter((url): url is string => !!url);
  const activeFileNames = finalUrls.map((url) => getFileNameFromUrl(url));
  
  await cleanupStorageFiles(supabaseClient, "products", `${folder}/${type}`, activeFileNames);
  return finalUrls;
};

// 최종 데이터 처리 함수 (이미지 업로드 + URL 정리)
export const prepareProductData = async (supabaseClient: any, activeItems: any[]) => {
  return await Promise.all(
    activeItems.map(async (item, index) => {
      const currentId = item.isNew
        ? await ensureRecordId(supabaseClient, "products", {
            mainTitle: item.mainTitle,
            displayOrder: index + 1,
          })
        : item.id;

      const folder = `product-${String(currentId).padStart(2, "0")}`;

      // 메인 이미지
      let finalMain = item.image;
      if (item.tempMainFile) {
        const mainName = `main_${Date.now()}.webp`;
        await cleanupStorageFiles(supabaseClient, "products", folder, [mainName], "main_");
        finalMain = await uploadImage(supabaseClient, item.tempMainFile, "products", `${folder}/${mainName}`);
      }

      // 리스트 이미지
      const finalThumbs = await processImageList(supabaseClient, item.thumbnailImages, "thumb", folder);
      const finalDetails = await processImageList(supabaseClient, item.detailImages, "detail", folder);

      const { tempMainFile, isNew, isDeleted, previewUrl, ...rest } = item;
      return {
        ...rest,
        id: currentId,
        image: finalMain,
        thumbnailImages: finalThumbs,
        detailImages: finalDetails,
        displayOrder: index + 1,
      };
    })
  );
};