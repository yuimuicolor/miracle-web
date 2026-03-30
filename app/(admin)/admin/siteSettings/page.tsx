"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import AdminSaveButton from "@/components/admin/AdminSaveButton";
import { AdminInput } from "@/components/admin/AdminInput";
import Image from "next/image";
import { useSiteSettingsManager } from "@/hooks/useSiteSettingsManager";
import { useRef } from "react";

export default function AdminSiteSettingsPage() {
  const {
    items, loading, isSaving,
    handleChange, handleSNSChange, handleReplaceImage, handleSave
  } = useSiteSettingsManager();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (loading) return <div className="p-10 text-center">불러오는 중...</div>;

  return (
    <div className="mx-auto">
      <AdminHeader title="사이트 기본 설정" subtitle="브랜드 정보 및 하단 푸터 정보를 관리합니다." tip="* 변경사항이 있을 경우 [저장] 버튼을 눌러주세요." />

      <div className="flex justify-end mb-6">
        <AdminSaveButton onClick={handleSave} isSaving={isSaving} />
      </div>

      <div className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        {/* 로고 설정 섹션 */}
        <section>
          <h3 className="text-admin-body font-bold mb-4">브랜드 로고</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-40 h-20 bg-slate-300 rounded-xl overflow-hidden border border-slate-200">
              <Image
                src={items?.previewUrl || items?.brandLogoSrc || ""}
                alt="p"
                fill
                className="object-cover"
                loading="eager"
                unoptimized
              />
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-admin- hover:bg-slate-700 transition-colors">
              로고 교체
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleReplaceImage(file);
            }} />
          </div>
        </section>

        {/* 기본 정보 섹션 */}
        <section className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-admin- font-semibold mb-2">브랜드명</label>
            <AdminInput value={items?.brandName || ""} onChange={(v) => handleChange("brandName", v)} />
          </div>
          <div>
            <label className="block text-admin- font-semibold mb-2">대표자명</label>
            <AdminInput value={items?.ownerName || ""} onChange={(v) => handleChange("ownerName", v)} />
          </div>
            <div>
            <label className="block text-admin- font-semibold mb-2">연락처</label>
            <AdminInput value={items?.phone || ""} onChange={(v) => handleChange("phone", v)} />
          </div>
          <div>
            <label className="block text-admin- font-semibold mb-2">이메일</label>
            <AdminInput value={items?.email || ""} onChange={(v) => handleChange("email", v)} />
          </div>
          <div>
            <label className="block text-admin- font-semibold mb-2">사업자 등록번호</label>
            <AdminInput value={items?.businessRegistrationNumber || ""} onChange={(v) => handleChange("businessRegistrationNumber", v)} />
          </div>
         
           <div>
            <label className="block text-admin- font-semibold mb-2">영업시간</label>
            <AdminInput value={items?.businessHours || ""} onChange={(v) => handleChange("businessHours", v)} placeholder="Information 란에 노출될 영업시간을 입력해 주세요."/>
          </div>
          <hr className="col-span-2 border-slate-300 mt-6 mb-2" />
          
          <div className="col-span-2">
            <label className="block text-admin- font-semibold mb-2">주소</label>
            <AdminInput value={items?.address || ""} onChange={(v) => handleChange("address", v)} placeholder="도로명 주소를 입력해 주세요." />
          </div>
          <div>
            <label className="block text-admin- font-semibold mb-2">Google Map 제목</label>
            <AdminInput value={items?.mapTitle || ""} onChange={(v) => handleChange("mapTitle", v)} placeholder="Google 지도에 표시될 이름을 입력해 주세요." />
          </div>
          <div>
            <label className="block text-admin- font-semibold mb-2">Google Map 링크</label>
            <AdminInput value={items?.mapLink || ""} onChange={(v) => handleChange("mapLink", v)} placeholder="https://www.google.com/maps/place/로 시작하는 정확한 주소를 입력해 주세요."/>
          </div>
          
        </section>

        <hr className="col-span-2 border-slate-300 mt-6" />
        {/* SNS 설정 섹션 */}
        <section>
          <h3 className="text-admin-body font-bold mb-4 text-slate-700">SNS 연결</h3>
          <div className="grid gap-4">
            {Object.entries(items?.snsConfig || {}).map(([platform, config]) => (
              <div key={platform} className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl">
                <span className="w-50 font-bold uppercase">{platform}</span>
                <AdminInput value={config.href} placeholder="URL을 입력하세요 (https://...)" onChange={(v) => handleSNSChange(platform, "href", v)} />
              </div>
            ))}
          </div>
        </section>

        <hr className="col-span-2 border-slate-300 mt-6" />
        <section>
          <label className="block text-admin- font-semibold mb-2">개인정보처리방침</label>
          <textarea
            className="w-full h-100 p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-200"
            value={items?.privacyPolicyText || ""}
            onChange={(e) => handleChange("privacyPolicyText", e.target.value)}
          />
        </section>
      </div>
      <div className="flex justify-center mt-10">
        <AdminSaveButton onClick={handleSave} isSaving={isSaving} size="large" />
      </div>
    </div>
  );
}