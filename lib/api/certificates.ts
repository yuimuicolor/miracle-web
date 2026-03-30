import { CertificateItem } from "../types/aboutUs";

// 1. GET 

export const getCertificatesItems = async (): Promise<CertificateItem[]> => {
  const res = await fetch("/api/certificates", { cache: "no-store" });
  if (!res.ok) {
    console.error("인증서 데이터를 불러오는데 실패했습니다.");
    return [];
  }
  return res.json();
};

export const getCertificatesItemsByServer = async (supabaseClient:any): Promise<CertificateItem[]> => {
  const {data,error} = await supabaseClient
    .from("certificates")
    .select("*")
    .order("displayOrder", { ascending: true });

    if (error) {
      console.error("인증서 데이터를 불러오는데 실패했습니다.", error);
      return [];
    }
    return data || [];
};


// 3. POST (업데이트/생성/삭제 한번에 처리)
export const saveCertificatesItems = async (items: CertificateItem[]) => {
  // 삭제할 Item ID 필터링
  const deletedIds = items.filter(item => item.isDeleted && !item.isNew).map(item => item.id);
  const finalItems = items
    .filter(item => !item.isDeleted)
    .map((item) => ({
      id: item.id,
      title: item.title,
      desc: item.desc,
      imageUrl: item.imageUrl,
      isVisible: item.isVisible,
      displayOrder: item.displayOrder,
    }));

  const res = await fetch(`/api/certificates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ finalItems, deletedIds }),
  });

  if (!res.ok) throw new Error("서버 저장에 실패했습니다.");
  return res.json();
};