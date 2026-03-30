import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {

    const { data, error } = await supabaseServer
      .from("siteSettings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data) {
      return NextResponse.json({ message: "Settings not found" }, { status: 404 });
    }

    // 데이터 가공 (기존 로직 그대로 서버에서 처리)
    const settings = {
      ...data,
      snsConfig: data.snsConfig || {
        instagram: { href: "", label: "instagram" },
        youtube: { href: "", label: "youtube" },
        x: { href: "", label: "x" },
      },
    };

    return NextResponse.json(settings);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const newData = await request.json();
    const { data, error } = await supabaseServer
      .from("siteSettings")
      .update(newData)
      .eq("id", 1)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}