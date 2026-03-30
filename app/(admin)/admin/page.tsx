"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    newInquiries: 0,
    totalProducts: 0,
    galleryImages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);

        // 1. 새로운 문의 (미확인 상태만)
        const { count: newCount } = await supabase
          .from("contacts")
          .select("*", { count: "exact", head: true })
          .eq("status", "미확인");

        // 2. 전체 상품 개수
        const { count: productCount } = await supabase
          .from("products") // 누나 프로젝트의 상품 테이블명 확인!
          .select("*", { count: "exact", head: true });

        // 3. 갤러리 이미지 개수
        const { count: galleryCount } = await supabase
          .from("gallery") // 누나 프로젝트의 갤러리 테이블명 확인!
          .select("*", { count: "exact", head: true });

        setCounts((prev) => ({
          ...prev,
          newInquiries: newCount || 0,
          totalProducts: productCount || 0,
          galleryImages: galleryCount || 0,
        }));
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const stats = [
    {
      label: "새로운 문의",
      value: `${counts.newInquiries}건`,
      color: "text-red-600",
      href: "/admin/contacts?status=미확인",
    },
    {
      label: "전체 상품",
      value: `${counts.totalProducts}개`,
      color: "text-blue-600",
      href: "/admin/products",
    },
    {
      label: "갤러리 사진",
      value: `${counts.galleryImages}장`,
      color: "text-green-600",
      href: "/admin/gallery",
    },
    {
      label: "사이트관리",
      value: "설정⚙",
      color: "text-gray-600",
      href: "/admin/siteSettings",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const CardContent = (
            <div
              className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all relative ${stat.href ? "hover:shadow-md hover:border-blue-300 cursor-pointer" : ""}`}
            >
              {/* 1. 우측 상단 깜빡이는 빨간 점 (새로운 문의 > 0 일 때만) */}
              {stat.label === "새로운 문의" && counts.newInquiries > 0 && (
                <span className="absolute top-4 right-4 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}

              <p className="text-admin-subtitle text-gray-500 font-medium">
                {stat.label}
              </p>

              {loading ? (
                <div className="h-8 w-16 bg-gray-100 animate-pulse mt-1 rounded" />
              ) : (
                <div className="flex items-center gap-2">
                  <p className={`text-admin-body font-bold mt-1 ${stat.color}`}>
                    {stat.value}
                  </p>

                  {/* 2. 숫자 옆에 'N' 표시 */}
                  {stat.label === "새로운 문의" && counts.newInquiries > 0 && (
                    <span className="mt-1 px-1.5 py-0.5 bg-red-100 text-red-600 text-[1rem] font-black rounded-md">
                      N
                    </span>
                  )}
                </div>
              )}
            </div>
          );

          return stat.href ? (
            <Link key={i} href={stat.href}>
              {CardContent}
            </Link>
          ) : (
            <div key={i}>{CardContent}</div>
          );
        })}
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-admin-subtitle font-bold mb-4">공지사항</h3>
        <ul className="text-admin-body list-disc list-inside space-y-2 text-gray-600">
          <li>문의 사항 중 '미확인' 상태는 가능한 빨리 처리해 주세요.</li>
          <li>사이트 설정 변경 시 실제 사이트에 즉시 반영되니 주의하세요!</li>
        </ul>
      </div>
    </div>
  );
}
