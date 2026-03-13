"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { ContactData } from "@/types/contact";

const STYLE = {
  section: 'h-screen px-20 flex flex-col justify-center bg-bg-dark border-t border-white/5',
  title: 'font-gilda text-[5rem] uppercase text-white',
  divider: 'w-full h-px bg-white mb-16',
  form: 'max-w-6xl w-full',
  formGrid: 'grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10',
  fieldRow: 'flex items-center gap-8 border-b border-white/20 pb-2 focus-within:border-point-green transition-colors',
  fieldRowMessage: 'col-span-1 md:col-span-2 flex items-start gap-8 border-b border-white/20 pb-2 focus-within:border-point-green transition-colors',
  label: 'font-pretendard text-sm w-20 shrink-0 text-white/60',
  labelMessage: 'font-pretendard text-sm w-20 shrink-0 mt-2 text-white/60',
  input: 'w-full bg-transparent outline-none font-pretendard text-lg',
  textarea: 'w-full bg-transparent outline-none font-pretendard text-lg resize-none',
  submitWrap: 'mt-16 flex flex-col items-center gap-6',
  submitGuide: 'font-pretendard text-sm text-white/40',
  submitButton: 'bg-point hover:bg-point-light text-white px-24 py-5 rounded-full font-pretendard font-bold text-xl transition-all hover:scale-105 active:scale-95',
};

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
    void supabase;
    // ... 나머지 로직
  };

  return (
    <section className={STYLE.section}>
      <h1 className={STYLE.title}>
        Contact US*
      </h1>
      <div className={STYLE.divider} />

      <form onSubmit={handleSubmit} className={STYLE.form}>
        <div className={STYLE.formGrid}>
          {/* 이름 */}
          <div className={STYLE.fieldRow}>
            <label className={STYLE.label}>
              이름 NAME
            </label>
            <input
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className={STYLE.input}
            />
          </div>
          {/* 연락처 */}
          <div className={STYLE.fieldRow}>
            <label className={STYLE.label}>
              연락처 PHONE
            </label>
            <input
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className={STYLE.input}
            />
          </div>
          {/* 이메일 */}
          <div className={STYLE.fieldRow}>
            <label className={STYLE.label}>
              이메일 EMAIL
            </label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={STYLE.input}
            />
          </div>
          {/* 회사명 */}
          <div className={STYLE.fieldRow}>
            <label className={STYLE.label}>
              회사명 COMPANY
            </label>
            <input
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={STYLE.input}
            />
          </div>
          {/* 메시지 (Full Width) */}
          <div className={STYLE.fieldRowMessage}>
            <label className={STYLE.labelMessage}>
              내용 MESSAGE
            </label>
            <textarea
              name="message"
              required
              rows={3}
              value={formData.message}
              onChange={handleChange}
              className={STYLE.textarea}
            />
          </div>
        </div>

        <div className={STYLE.submitWrap}>
          <p className={STYLE.submitGuide}>
            개인정보 수집 및 이용에 동의할 경우 제출 버튼을 눌러주세요.
          </p>
          <button
            type="submit"
            className={STYLE.submitButton}
          >
            SEND MESSAGE
          </button>
        </div>
      </form>
    </section>
  );
}
