"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { ContactData } from "@/types/contact";

const STYLE = {
  section: `w-full min-h-screen-minus-header-offset bg-point
  px-[1.6rem] md:px-[4rem] lg:px-[8rem]
  pt-[10rem] md:pt-[14rem] lg:pt-[17rem]
  pb-[8rem]`,
  inner: 'w-full mx-auto',
  title: 'font-gilda text-[3.6rem] md:text-[5.6rem] lg:text-[8rem] uppercase text-white leading-none',
  titleStar: 'text-point-light',
  divider: 'w-full h-px bg-white mt-[1rem] md:mt-[2rem] lg:mt-[3rem] mb-[2rem] md:mb-[4rem] lg:mb-[6rem]',
  form: 'w-full',
  formGrid: 'grid grid-cols-1 lg:grid-cols-2 gap-x-[4rem] lg:gap-x-[4rem] gap-y-[0.8rem] md:gap-y-[2rem] lg:gap-y-[4rem]',
  fieldBlock: 'flex flex-col gap-[0.6rem] lg:flex-row lg:items-center lg:gap-[2rem]',
  fieldBlockMessage: 'lg:col-span-2 flex flex-col gap-[0.6rem] lg:flex-row lg:items-start lg:gap-[2rem]',
  label: 'font-normal flex gap-[0.4rem] text-[1.8rem] md:text-[2rem] lg:text-[2.4rem] tracking-[-0.01em] lg:w-[10rem] lg:shrink-0',
  required: 'text-point-green',
  input: 'w-full h-[4.8rem] md:h-[6rem] lg:h-[7.2rem] bg-white/50 focus:bg-white px-[1.2rem] md:px-[1.6rem] text-[1.8rem] md:text-[2rem] lg:text-[2.4rem] text-black outline-none transition-colors duration-500',
  textarea: 'w-full h-[15rem] md:h-[18rem] bg-white/50 focus:bg-white px-[1.2rem] md:px-[1.6rem] py-[1.2rem] text-[1.8rem] md:text-[2rem] lg:text-[2.4rem] text-black outline-none resize-none transition-colors duration-500',
  submitWrap: 'mt-[1.2rem] flex w-full flex-col gap-[4rem]',
  consentLabel: 'flex items-center gap-[0.8rem] w-full text-[1.6rem] md:text-[1.8rem] lg:ml-[12rem] tracking-[-0.05rem] lg:w-[calc(100%-12rem)]',
  checkbox: 'h-[1.8rem] w-[1.8rem] accent-white',
  submitButton: 'self-center w-[28rem] h-[8rem] rounded-full bg-white text-point text-[3.2rem] font-pretendard font-bold hover:bg-white transition-colors',
};

export default function ContactUsSection() {
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
  };

  return (
    <section className={STYLE.section}>
      <div className={STYLE.inner}>
        <h1 className={STYLE.title}>
          CONTACT US<span className={STYLE.titleStar}>*</span>
        </h1>
        <div className={STYLE.divider} />

        <form onSubmit={handleSubmit} className={STYLE.form}>
          <div className={STYLE.formGrid}>
            <div className={STYLE.fieldBlock}>
              <label className={STYLE.label}>
                이름<span className={STYLE.required}>*</span>
              </label>
              <input
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={STYLE.input}
              />
            </div>

            <div className={STYLE.fieldBlock}>
              <label className={STYLE.label}>
                연락처<span className={STYLE.required}>*</span>
              </label>
              <input
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className={STYLE.input}
              />
            </div>

            <div className={STYLE.fieldBlock}>
              <label className={STYLE.label}>
                이메일<span className={STYLE.required}>*</span>
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

            <div className={STYLE.fieldBlock}>
              <label className={STYLE.label}>
                회사명
              </label>
              <input
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={STYLE.input}
              />
            </div>

            <div className={STYLE.fieldBlockMessage}>
              <label className={STYLE.label}>
                내용<span className={STYLE.required}>*</span>
              </label>
              <textarea
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className={STYLE.textarea}
              />
            </div>
          </div>

          <div className={STYLE.submitWrap}>
            <label className={STYLE.consentLabel}>
              <input type="checkbox" required className={STYLE.checkbox} />
              <span>(필수) 아래 개인정보 이용 정책에 동의합니다. <span className="font-bold">[전문보기]</span></span>
            </label>

            <button
              type="submit"
              className={STYLE.submitButton}
            >
              제출
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
