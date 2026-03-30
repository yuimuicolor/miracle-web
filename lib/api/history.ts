import { HistoryItem } from "../types/aboutUs";


// 1. GET
export const getHistoryItems = async (): Promise<HistoryItem[]> => {
  const res = await fetch("/api/history", { cache: "no-store" });

  if (!res.ok) {
    console.error("히스토리 데이터를 불러오는데 실패했습니다.");
    return [];
  }
  return res.json();
};

export const getHistoryItemsByServer = async (supabaseClient:any): Promise<HistoryItem[]> => {
  const {data,error} = await supabaseClient
    .from("history")
    .select("*")
    .order("displayOrder", { ascending: true });


    if (error) {
      console.error("히스토리 데이터를 불러오는데 실패했습니다.", error);
      return [];
    }
    return data || [];
};


// 3. POST (업데이트/생성/삭제 한번에 처리)
export const saveHistoryItems = async (items: HistoryItem[]) => {
  // 삭제할 Item ID 필터링
  const deletedIds = items
    .filter((item) => item.isDeleted && !item.isNew)
    .map((item) => item.id);
  const finalItems = items
    .filter((item) => !item.isDeleted)
    .map((item) => ({
      id: item.id,
      year: item.year,
      date: item.date,
      title: item.title,
      imageUrl: item.imageUrl,
      isVisible: item.isVisible,
      displayOrder: item.displayOrder,
    }));

  const res = await fetch(`/api/history`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ finalItems, deletedIds }),
  });

  if (!res.ok) throw new Error("서버 저장에 실패했습니다.");
  return res.json();
};
