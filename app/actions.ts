"use server";

import { ContactData } from "@/components/sections/ContactUsSection";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function sendContactEmail(submitData: ContactData) {
  try {
    // 1. Supabase 저장 (서버에서 수행)
    const { error: dbError } = await supabase
      .from("contacts")
      .insert([submitData]);

    if (dbError) throw new Error(dbError.message);

    // 2. 이메일 알림 발송
    await resend.emails.send({
      from: "onboarding@resend.dev", // 무료 플랜 기본 발신자
      to: "yuimuicolor@gmail.com", // 실제 관리자 이메일로 변경
      subject: `[문의등록] ${submitData.name}님의 메시지`,
      html: `
        <h3>새 문의가 왔어요!</h3>
        <p><b>성함:</b> ${submitData.name}</p>
        <p><b>연락처:</b> ${submitData.phone}</p>
        <p><b>회사:</b> ${submitData.company || "없음"}</p>
        <p><b>메시지:</b> ${submitData.message}</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Server Error:", error);
    return { success: false };
  }
}