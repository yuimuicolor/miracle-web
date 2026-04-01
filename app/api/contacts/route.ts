import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "30");
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseServer
    .from("contacts")
    .select("*", { count: "exact" })
    .order("createdAt", { ascending: sortOrder === "asc" })
    .range(from, to);

  if (status && status !== "전체") {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query;

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, count });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ids, updates } = body;

    let query = supabaseServer.from("contacts").update(updates);

    if (ids) {
      query = query.in("id", ids); // 일괄 업데이트
    } else {
      query = query.eq("id", id); // 단일 업데이트
    }

    const { error } = await query;
    if (error) throw error;

    return NextResponse.json({ message: "업데이트 완료" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const resend = new Resend(process.env.RESEND_API_KEY);
export async function POST(request: Request) {
  
console.log("Resend API Key:", process.env.RESEND_API_KEY ? "Loaded" : "Missing");

  try {
    const body = await request.json();
    const { name, email, phone, company, message, status, token } = body;

    const verifyRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      { method: "POST" },
    );
    const verifyData = await verifyRes.json();

    if (!verifyData.success || verifyData.score < 0.5) {
      return NextResponse.json(
        { error: "보안 검증에 실패했습니다. (봇 의심)" },
        { status: 403 },
      );
    }

    const { error: dbError } = await supabaseServer
      .from("contacts")
      .insert([{ name, email, phone, company, message, status }]);

    if (dbError) throw new Error(`DB 저장 실패: ${dbError.message}`);

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "yuimuicolor@gmail.com",
      subject: `[문의등록] ${name}님의 메시지`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h3>새 문의가 도착했습니다!</h3>
          <p><b>성함:</b> ${name}</p>
          <p><b>이메일:</b> ${email}</p>
          <p><b>연락처:</b> ${phone}</p>
          <p><b>회사명:</b> ${company || "없음"}</p>
          <hr />
          <p><b>문의내용:</b></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
