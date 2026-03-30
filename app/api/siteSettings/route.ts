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
    const rawData = await request.json();

    // id를 포함해서 DB 컬럼이 아닌 모든 것들을 확실히 제외합니다.
    const { id, tempFile, previewUrl, ...cleanData } = rawData;

    const { data, error } = await supabaseServer
      .from("siteSettings")
      .update(cleanData) // 여기서 cleanData에는 'id'가 없어야 합니다!
      .eq("id", 1)       // 수정할 대상은 여기서 지정하니까요.
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    // 500 에러가 나면 브라우저 Console -> Network 탭에서 
    // 응답 내용(Response)에 찍히는 구체적인 에러 메시지를 꼭 확인해보세요!
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}