import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabaseServer } from "@/lib/supabase/server";

export const authOptions: NextAuthOptions = {
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
        return null;
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async signIn({ user }) {
      const { data, error } = await supabaseServer.auth.signInWithPassword({
        email: process.env.NEXT_PUBLIC_SUPABASE_ADMIN_EMAIL!,
        password: process.env.NEXT_PUBLIC_SUPABASE_ADMIN_PASSWORD!,
      });
      if (error) return false;
      return true;
    },
    async session({ session }) {
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};