"use server";

import { ContactItem } from "@/lib/types/contact";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 1. 입력받을 데이터 타입 정의 (Pick 사용)
type ContactInput = Pick<ContactItem, "name" | "phone" | "email" | "company" | "message">;

export async function sendContactEmail(submitData: ContactInput) { 
  try {
    const { error: dbError } = await supabase
      .from("contacts")
      .insert([
        {
          ...submitData,
          status: "미확인", 
        }
      ]);

    if (dbError) {
      console.error("DB Error:", dbError.message);
      throw new Error("데이터 저장 중 오류가 발생했습니다.");
    }

    // 3. 이메일 알림 발송
    await resend.emails.send({
      from: "onboarding@resend.dev", 
      to: "yuimuicolor@gmail.com", 
      subject: `[문의등록] ${submitData.name}님의 메시지`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h3>새 문의가 도착했습니다!</h3>
          <p><b>성함:</b> ${submitData.name}</p>
          <p><b>이메일:</b> ${submitData.email}</p>
          <p><b>연락처:</b> ${submitData.phone}</p>
          <p><b>회사명:</b> ${submitData.company || "없음"}</p>
          <hr />
          <p><b>문의내용:</b></p>
          <p style="white-space: pre-wrap;">${submitData.message}</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Server Action Error:", error);
    return { success: false, message: error instanceof Error ? error.message : "알 수 없는 오류" };
  }
}