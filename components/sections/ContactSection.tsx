"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { ContactData } from "@/types/contact";

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactData>({
    name: "",
    phone: "",
    email: "",
    company: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ... 나머지 로직
  };

  return (
    <section className="h-screen px-20 flex flex-col justify-center bg-bg-dark border-t border-white/5">
      <h1 className="font-gilda text-[80px] uppercase text-white">
        Contact US*
      </h1>
      <div className="w-full h-px bg-white mb-16" />

      <form onSubmit={handleSubmit} className="max-w-6xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
          {/* 이름 */}
          <div className="flex items-center gap-8 border-b border-white/20 pb-2 focus-within:border-point-green transition-colors">
            <label className="font-pretendard text-sm w-20 shrink-0 text-white/60">
              이름 NAME
            </label>
            <input
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-transparent outline-none font-pretendard text-lg"
            />
          </div>
          {/* 연락처 */}
          <div className="flex items-center gap-8 border-b border-white/20 pb-2 focus-within:border-point-green transition-colors">
            <label className="font-pretendard text-sm w-20 shrink-0 text-white/60">
              연락처 PHONE
            </label>
            <input
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-transparent outline-none font-pretendard text-lg"
            />
          </div>
          {/* 이메일 */}
          <div className="flex items-center gap-8 border-b border-white/20 pb-2 focus-within:border-point-green transition-colors">
            <label className="font-pretendard text-sm w-20 shrink-0 text-white/60">
              이메일 EMAIL
            </label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent outline-none font-pretendard text-lg"
            />
          </div>
          {/* 회사명 */}
          <div className="flex items-center gap-8 border-b border-white/20 pb-2 focus-within:border-point-green transition-colors">
            <label className="font-pretendard text-sm w-20 shrink-0 text-white/60">
              회사명 COMPANY
            </label>
            <input
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full bg-transparent outline-none font-pretendard text-lg"
            />
          </div>
          {/* 메시지 (Full Width) */}
          <div className="col-span-1 md:col-span-2 flex items-start gap-8 border-b border-white/20 pb-2 focus-within:border-point-green transition-colors">
            <label className="font-pretendard text-sm w-20 shrink-0 mt-2 text-white/60">
              내용 MESSAGE
            </label>
            <textarea
              name="message"
              required
              rows={3}
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-transparent outline-none font-pretendard text-lg resize-none"
            />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-6">
          <p className="font-pretendard text-sm text-white/40">
            개인정보 수집 및 이용에 동의할 경우 제출 버튼을 눌러주세요.
          </p>
          <button
            type="submit"
            className="bg-point hover:bg-point-light text-white px-24 py-5 rounded-full font-pretendard font-bold text-xl transition-all hover:scale-105 active:scale-95"
          >
            SEND MESSAGE
          </button>
        </div>
      </form>
    </section>
  );
}
