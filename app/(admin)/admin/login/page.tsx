"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { supabase } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    // NextAuth의 signIn 함수 호출
    const result = await signIn("credentials", {
      username: userId,
      password: password,
      redirect: false, // 성공해도 바로 튕기지 말고 결과값부터 받기
    });

    if (result?.error) {
      setError("아이디/비밀번호 오류입니다. 다시 시도해주세요.");
    } else if (result?.ok) {
      // 💡 [핵심] 2. 브라우저의 Supabase 객체도 직접 로그인 시킵니다.
      // 이렇게 해야 브라우저 쿠키/로컬스토리지에 Supabase 전용 '신분증'이 저장돼요!
      const { error } = await supabase.auth.signInWithPassword({
        email: process.env.NEXT_PUBLIC_SUPABASE_ADMIN_EMAIL!, // 공개 가능한 관리자 계정 이메일
        password: process.env.NEXT_PUBLIC_SUPABASE_ADMIN_PASSWORD!,
      });

      if (error) {
        alert("Supabase 인증 실패: " + error.message);
        return;
      }

      // 둘 다 성공하면 대시보드로 이동
      window.location.href = "/admin";
    } else {
      alert("로그인 정보가 일치하지 않습니다.");
    }
  };


  return (
    <div className="flex h-full items-center justify-center bg-slate-100 text-black font-noto tracking-tight">
      <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-xl">
        <h1 className="text-admin-title font-bold text-center mb-8">ADMIN</h1>
        <form onSubmit={handleLogin} className="space-y-6 text-admin-body">
          <div>
            <label className="block text-admin-subtitle font-medium mb-1">아이디</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
              placeholder="Admin ID"
              required
            />
          </div>
          <div>
            <label className="block text-admin-subtitle font-medium mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
              placeholder="Password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-admin-small">{error}</p>}
          <button
            type="submit"
            className="w-full bg-slate-900 text-white p-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            로그인하기
          </button>
        </form>
      </div>
    </div>
  );
}