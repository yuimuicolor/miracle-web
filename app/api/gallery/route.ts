import { deleteItemsWithStorage } from "@/lib/api/common";
import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get("admin") === "true";

  let query = supabaseServer.from("gallery").select("*");

  // 관리자 페이지일 때는 isVisible 여부 상관없이 다 가져오고, 일반 페이지일 때는 isVisible이 true인 것만 가져옴.
  if (!isAdmin) {
    query = query.eq("isVisible", true);
  }

  const { data, error } = await query.order("displayOrder", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const safeData = data.map(item => ({
    ...item,
    imageUrl: item.imageUrl?.startsWith('http') 
      ? item.imageUrl 
      : `${supabaseUrl}/storage/v1/object/public/gallery/${item.imageUrl}`
  }));

  return NextResponse.json(safeData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { finalItems, deletedIds } = body;

    // 1. 삭제 처리
   if (deletedIds?.length > 0) {
      const { data: toDelete } = await supabaseServer.from("gallery").select("id, imageUrl").in("id", deletedIds);
      if (toDelete) {
        await deleteItemsWithStorage(supabaseServer, "gallery", "gallery", toDelete);
      }
    }

    // 2. 신규/수정 처리 (Upsert)
    const { error } = await supabaseServer
      .from("gallery")
      .upsert(finalItems);

    if (error) throw error;

    return NextResponse.json({ message: "저장 완료!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}