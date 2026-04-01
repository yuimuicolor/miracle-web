import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    // 1. 구글 서버에 토큰 검증 요청 (Secret Key는 서버에서만 사용!)
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    // 2. 검증 결과 반환
    if (data.success) {
      return NextResponse.json({
        success: true,
        score: data.score,
        action: data.action,
      });
    } else {
      return NextResponse.json(
        { success: false, error: data["error-codes"] },
        { status: 400 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "서버 검증 중 오류 발생" },
      { status: 500 }
    );
  }
}