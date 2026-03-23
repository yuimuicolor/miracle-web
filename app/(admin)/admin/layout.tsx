"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import LogoutButton from "./LogoutButton";
import Logo from "@/components/sections/common/Logo";
import { useSettings } from "@/context/SiteSettingsContext";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 사이드바 메뉴 구성
  const menuItems = [
    { name: "대시보드", href: "/admin", icon: "🏠" },
    { name: "문의 관리", href: "/admin/contacts", icon: "📧" },
    { name: "갤러리 관리", href: "/admin/gallery", icon: "🖼️" },
    { name: "상품 관리", href: "/admin/products", icon: "🛍️" },
    { name: "사이트 설정", href: "/admin/settings", icon: "⚙️" },
  ];

  const session = await getServerSession();
  const settings = useSettings();

  return (
    <div className="flex min-h-screen bg-gray-100 font-noto tracking-tight text-black">
      {/* 사이드바 */}
      <aside className="w-100 bg-slate-900 text-white flex flex-col">
        <div className="p-10 text-4xl flex flex-col gap-6 border-b border-slate-800">
            <Logo />
            <Link href="/">관리자</Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 text-sm text-slate-400">
          © 2026 {settings?.brandName} Web
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold">관리자 모드</h2>
          <div className="flex items-center gap-4">
            {/* 세션에 저장된 이름 표시: 세션 있을 때만 렌더 */}
            {session && session.user?.name && (
              <span className="text-sm font-medium">{session.user.name}님</span>
            )}
            <LogoutButton />
          </div>
        </header>
        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  );
}
