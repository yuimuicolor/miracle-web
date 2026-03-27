import { supabaseServer } from "@/lib/supabase/server";
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