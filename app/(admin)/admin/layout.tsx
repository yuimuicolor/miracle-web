"use client";

import Link from "next/link";
import { useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import Logo from "@/components/sections/common/Logo";
import { useSession } from "next-auth/react";
import { useSettings } from "@/context/SiteSettingsContext";
import NextAuthProvider from "@/components/provider/NextAuthProvider";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <NextAuthProvider>
      <AdminContent>{children}</AdminContent>
    </NextAuthProvider>
  );
}

function AdminContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const settings = useSettings();

  const { data: session } = useSession();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 페이지 이동 시 사이드바 자동으로 닫기
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // 사이드바 메뉴 구성
  const menuItems = [
    { name: "대시보드", href: "/admin", icon: "🏠" },
    { name: "문의 관리", href: "/admin/contacts", icon: "📧" },
    { name: "상품 관리", href: "/admin/products", icon: "🛍️" },
    { name: "갤러리 관리", href: "/admin/gallery", icon: "🖼️" },
    { name: "히스토리 관리", href: "/admin/history", icon: "⏱" },
    { name: "인증서 관리", href: "/admin/certificates", icon: "📜" },
    { name: "사이트 설정", href: "/admin/siteSettings", icon: "⚙️" },
  ];

  return (
    <NextAuthProvider>
      <div className="flex min-h-screen bg-gray-100 font-noto tracking-tight text-black overflow-x-hidden">

        {/* 2. 모바일용 오버레이 (사이드바 열렸을 때 뒷배경 어둡게) */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* 3. 사이드바 (반응형 설정) */}
        <aside className={`
        fixed inset-y-0 left-0 z-50 w-full lg:w-100 bg-slate-900 text-white flex flex-col shrink-0
        transition-transform duration-300 transform
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:relative lg:translate-x-0 lg:w-80
      `}>
          <div className="p-8 flex gap-6 items-start justify-between border-b border-slate-800">
            
            <div className="flex flex-col justify-start items-start gap-2 text-admin-title">
              <Link href="/"><Logo /></Link>
            <Link href="/admin">관리자 페이지</Link>
            </div>
            
            <button className="lg:hidden text-4xl" onClick={() => setIsSidebarOpen(false)}>✕</button>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all group ${isActive ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  <span className={`w-12 text-4xl ${isActive ? "opacity-100" : "opacity-50"}`}>{item.icon}</span>
                  <span className="text-admin-body font-bold">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-slate-800 text-xs text-slate-500 text-center">
            © 2026 {settings?.brandName || "Miracle"}
          </div>
        </aside>

        {/* 4. 메인 콘텐츠 영역 */}
        <main className="flex-1 flex flex-col min-w-0 w-full">
          {/* 상단 헤더 (햄버거 버튼 포함) */}
          <header className="h-20 lg:h-24 bg-white border-b flex items-center justify-between px-6 lg:px-10 shadow-sm sticky top-0 z-30">
            <div className="flex items-center gap-4">
              {/* 햄버거 버튼 (lg 미만에서만 노출) */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 lg:hidden text-4xl hover:bg-gray-100 rounded-lg"
              >
                ☰
              </button>
              <h2 className="text-admin-body lg:text-admin-title font-bold text-slate-800">
                {settings?.brandName || "Miracle"} <span className="text-blue-600">Admin</span>
              </h2>
            </div>

            <div className="flex items-center gap-4 lg:gap-6">
              {session?.user?.name && (
                <div className="flex items-center gap-2">
                  <span className="text-admin-body font-bold">{session.user.name} 님</span>
                </div>
              )}
              <LogoutButton />
            </div>
          </header>

          {/* 페이지 내용 */}
          <div className="flex-1 p-4 lg:p-10">{children}</div>
        </main>
      </div>
    </NextAuthProvider>
  );
}
