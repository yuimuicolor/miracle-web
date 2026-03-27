import { supabaseServer } from "@/lib/supabase/server";
import { deleteItemsWithStorage } from "@/lib/api/common";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabaseServer
    .from("products")
    .select("*")
    .order("displayOrder", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const safeData = data.map((item) => ({
    ...item,
    image: item.image && item.image.trim() !== "" ? item.image : null,
  }));

  return NextResponse.json(safeData);
}

export async function POST(request: Request) {
  try {
    const { finalItems, deletedIds } = await request.json();

    // 1. 삭제 처리 (DB 레코드 + 스토리지 폴더 통째로 날리기)
    if (deletedIds?.length > 0) {
      const { data: toDelete } = await supabaseServer
        .from("products")
        .select("id, image, thumbnailImages, detailImages")
        .in("id", deletedIds);

      if (toDelete) {
        // 모든 이미지 URL을 하나로 합쳐서 스토리지 삭제 호출
        const formattedToDelete = toDelete.map(item => ({
          id: item.id,
          imageUrl: [
            item.image, 
            ...(item.thumbnailImages || []), 
            ...(item.detailImages || [])
          ].filter(Boolean)
        }));
        await deleteItemsWithStorage(supabaseServer, "products", "products", formattedToDelete);
      }
    }

    // 2. 저장 (Upsert)
    if (finalItems?.length > 0) {
      const { error } = await supabaseServer.from("products").upsert(finalItems);
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}