import Link from "next/link";
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import LogoutButton from "./LogoutButton";

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

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 사이드바 */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-slate-800">
          <Link href="/">MIRACLE ADMIN</Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
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
          © 2026 Miracle Web
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold">관리자 모드</h2>
          <div className="flex items-center gap-4">
            {/* 세션에 저장된 이름 표시: 세션 있을 때만 렌더 */}
            {session && session.user?.name && (
              <span className="text-sm font-medium">{session.user.name}님</span>
            )}
            <LogoutButton />
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
