// app/api/products/route.ts
import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const referer = request.headers.get("referer") || "";
  const isAdmin = referer.includes("/admin");

  let query = supabaseServer
    .from("products")
    .select("*")
    .order("displayOrder", { ascending: true });

  if (!isAdmin) {
    query = query.eq("isVisible", true);
  }

  const { data, error } = await query;
  // ... (이후 데이터 처리 로직은 동일)

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
