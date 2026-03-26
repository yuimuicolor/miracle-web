import { supabase } from "@/lib/supabase";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Account",
      credentials: {
        username: { label: "아이디", type: "text" },
        password: { label: "비밀번호", type: "password" }
      },
      async authorize(credentials) {
        if (
          credentials?.username === process.env.ADMIN_USER &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: "1", name: "admin", email: "admin@miracle.com" };
        }
        // 로그인 실패
        return null;
      }
    })
  ],
  pages: {
    signIn: "/admin/login", // 로그인 페이지 주소
  },
callbacks: {
    async signIn({ user }) {
      // 1. NextAuth 로그인 성공 시, Supabase에도 똑같이 로그인 시킴
      const { data, error } = await supabase.auth.signInWithPassword({
        email: process.env.NEXT_PUBLIC_SUPABASE_ADMIN_EMAIL!, // Supabase에 등록한 관리자 이메일
        password: process.env.NEXT_PUBLIC_SUPABASE_ADMIN_PASSWORD!, // Supabase에 등록한 관리자 비번
      });

      if (error) return false; // Supabase 로그인 실패 시 접속 차단
      return true;
    },
    async session({ session }) {
      // 이제 세션이 유지되는 동안 supabase 객체는 '관리자' 신분을 가집니다.
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };