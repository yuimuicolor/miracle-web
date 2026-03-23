"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="text-admin-small font-semibold text-red-500 hover:underline"
    >
      로그아웃
    </button>
  );
}