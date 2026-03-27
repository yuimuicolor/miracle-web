"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { updateSiteSettings } from "@/lib/api/siteSettings";
import { AdminHeader } from "@/components/admin/AdminHeader";
import AdminSaveButton from "@/components/admin/AdminSaveButton";
import { AdminInput } from "@/components/admin/AdminInput";
import Image from "next/image";
import { uploadImage } from "@/lib/utils/storage";
import { SiteSettingsItem } from "@/lib/types/siteSettings";

export default function AdminSiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettingsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("siteSettings").select("*").eq("id", 1).single();
      if (data) setSettings(data);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleChange = (field: keyof SiteSettingsItem, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleSNSChange = (platform: string, field: "href" | "label", value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      snsConfig: {
        ...settings.snsConfig,
        [platform]: { ...settings.snsConfig[platform], [field]: value },
      },
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    try {
      const publicUrl = await uploadImage(file, "site", `logo-${crypto.randomUUID()}.webp`, {
        maxWidthOrHeight: 1000,
        maxSizeMB: 1
      });
      setSettings({ ...settings, brandLogoSrc: publicUrl });
      alert("로고가 임시 적용되었습니다. 저장 버튼을 눌러야 확정됩니다.");
    } catch (err) {
      alert("로고 업로드 중 오류가 발생했습니다.");
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await updateSiteSettings(settings);
      alert("✅ 사이트 설정이 저장되었습니다.");
    } catch (error) {
      alert("❌ 저장 실패");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">불러오는 중...</div>;

  return (
    <div className="mx-auto">
      <AdminHeader title="사이트 기본 설정" subtitle="브랜드 정보 및 하단 푸터 정보를 관리합니다." />

      <div className="flex justify-end mb-6">
        <AdminSaveButton onClick={handleSave} isSaving={isSaving} />
      </div>

      <div className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        {/* 로고 설정 섹션 */}
        <section>
          <h3 className="text-admin-body font-bold mb-4">브랜드 로고</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-40 h-20 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
              <Image src={settings?.brandLogoSrc || ""} alt="Logo" fill className="object-contain p-2" unoptimized />
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-admin- hover:bg-slate-700 transition-colors">
              로고 교체
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* 기본 정보 섹션 */}
        <section className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-admin- font-semibold text-slate-600 mb-2">브랜드명 (국문)</label>
            <AdminInput value={settings?.brandName || ""} onChange={(v) => handleChange("brandName", v)} />
          </div>
          <div>
            <label className="block text-admin- font-semibold text-slate-600 mb-2">브랜드명 (영문 대문자)</label>
            <AdminInput value={settings?.brandUppercaseName || ""} onChange={(v) => handleChange("brandUppercaseName", v)} />
          </div>
          <div>
            <label className="block text-admin- font-semibold text-slate-600 mb-2">사업자명</label>
            <AdminInput value={settings?.businessName || ""} onChange={(v) => handleChange("businessName", v)} />
          </div>
          <div>
            <label className="block text-admin- font-semibold text-slate-600 mb-2">대표자명</label>
            <AdminInput value={settings?.ownerName || ""} onChange={(v) => handleChange("ownerName", v)} />
          </div>
        </section>

        {/* SNS 설정 섹션 */}
        <section>
          <h3 className="text-admin-body font-bold mb-4 text-slate-700">SNS 연결</h3>
          <div className="grid gap-4">
            {Object.entries(settings?.snsConfig || {}).map(([platform, config]) => (
              <div key={platform} className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl">
                <span className="w-50 font-bold text-slate-600 uppercase">{platform}</span>
                <AdminInput value={config.href} placeholder="URL을 입력하세요 (https://...)" onChange={(v) => handleSNSChange(platform, "href", v)} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-admin- font-semibold text-slate-600 mb-2">개인정보처리방침</label>
          <textarea
            className="w-full h-100 p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-200"
            value={settings?.privacyPolicyText || ""}
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