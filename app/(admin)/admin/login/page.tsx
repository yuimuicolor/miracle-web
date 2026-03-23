"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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
    } else {
        // 로그인 성공 시 관리자 대시보드로 이동
      router.push("/admin");
      router.refresh();
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