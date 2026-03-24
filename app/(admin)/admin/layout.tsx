"use client";

import Link from "next/link";
import { ReactNode } from "react";
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

  // 사이드바 메뉴 구성
  const menuItems = [
    { name: "대시보드", href: "/admin", icon: "🏠" },
    { name: "문의 관리", href: "/admin/contacts", icon: "📧" },
    { name: "상품 관리", href: "/admin/products", icon: "🛍️" },
    { name: "갤러리 관리", href: "/admin/gallery", icon: "🖼️" },
    { name: "사이트 설정", href: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <NextAuthProvider>
      <div className="flex min-h-screen bg-gray-100 font-noto tracking-tight text-black">
        {/* 사이드바 */}
        <aside className="w-100 bg-slate-900 text-white flex flex-col shrink-0">
          <div className="p-10 text-admin-title flex flex-col gap-6 border-b border-slate-800">
            <Link href="/">
             <Logo />
             </Link>
            <Link href="/admin">
              관리자 페이지
            </Link>
          </div>

          <nav className="text-admin-body flex-1 px-4 py-8 space-y-2">
            {menuItems.map((item) => {
              // 💡 현재 경로가 메뉴의 href와 일치하는지 체크
              // /admin/contacts?status=... 같은 경우도 포함하기 위해 startsWith 사용
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all group
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" // ✅ 활성화: 파란 배경
                      : "text-slate-400 hover:bg-slate-800 hover:text-white" // 비활성화: 회색
                  }
                `}
                >
                  <span
                    className={`text-[1.8rem] transition-transform group-hover:scale-110 ${isActive ? "opacity-100" : "opacity-50"}`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-bold tracking-normal">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-slate-800 text-admin-small text-slate-500">
            © 2026 {settings?.brandName || "Miracle"} Admin
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-24 bg-white border-b flex items-center justify-between px-10 shadow-sm">
            <h2 className="text-admin-title font-bold text-slate-800">
              {settings?.brandName || "Miracle"}{" "}
              <span className="text-blue-600">Admin</span>
            </h2>
            <div className="flex items-center gap-6">
              {session?.user?.name && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600">
                    👤
                  </div>
                  <span className="text-admin-body font-bold">
                    {session.user.name} 님
                  </span>
                </div>
              )}
              <LogoutButton />
            </div>
          </header>

          {/* 스크롤 영역 */}
          <div className="flex-1 p-10 overflow-y-auto">{children}</div>
        </main>
      </div>
    </NextAuthProvider>
  );
}
