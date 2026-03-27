import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
)

{const { id } = await params;
  const { data, error } = await supabaseServer
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "상품이 존재하지 않습니다." }, { status: 404 });
  }

  const safeData = {
    ...data,
    image: data.image && data.image.trim() !== "" ? data.image : null,
  };

  return NextResponse.json(safeData);
}