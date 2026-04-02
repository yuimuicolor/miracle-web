import { deleteItemsWithStorage } from "@/lib/api/common";
import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const referer = request.headers.get("referer") || "";
  const isAdmin = referer.includes("/admin");

  // 1. 상품처럼 정렬 순서를 명시적으로 가져옴
  let query = supabaseServer
    .from("history")
    .select("*")
    .order("displayOrder", { ascending: true });

  // 관리자일 때만 isVisible 여부 상관없이 모두 가져옴
  if (!isAdmin) {
    query = query.eq("isVisible", true);
  }

  const { data, error } = await query;

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const safeData = data.map((item) => ({
    ...item,
    imageUrl: item.imageUrl || null,
  }));

  return NextResponse.json(safeData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { finalItems, deletedIds } = body;

    // 1. 삭제 처리
    if (deletedIds?.length > 0) {
      const { data: toDelete } = await supabaseServer
        .from("history")
        .select("id, imageUrl")
        .in("id", deletedIds);
      if (toDelete) {
        await deleteItemsWithStorage(
          supabaseServer,
          "history",
          "aboutUs/history",
          toDelete,
        );
      }
    }

    // 2. 신규/수정 처리 (Upsert)
    const { error } = await supabaseServer.from("history").upsert(finalItems);

    if (error) throw error;

    return NextResponse.json({ message: "저장 완료!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
