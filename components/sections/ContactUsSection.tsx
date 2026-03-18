"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { HOME_REVEAL } from "@/components/sections/homeMotion";
import { supabase } from "@/lib/supabase";
import { ContactData } from "@/types/contact";
import { HOME_CONTENT } from "@/lib/siteData";

const STYLE = {
  section: `
    w-full min-h-screen-minus-header-offset bg-point
    px-[1.6rem] pt-[10rem] pb-[8rem]
    md:px-[4rem] md:pt-[14rem]
    lg:px-[8rem] lg:pt-[17rem]
  `,
  inner: 'w-full mx-auto',
  title: `
    font-gilda uppercase leading-none text-white
    text-[3.6rem]
    md:text-[5.6rem]
    lg:text-[8rem]
  `,
  titleStar: 'text-point-light',
  divider: `
    w-full h-px bg-white
    mt-[1rem] mb-[2rem]
    md:mt-[2rem] md:mb-[4rem]
    lg:mt-[3rem] lg:mb-[6rem]
  `,
  form: 'w-full',
  formGrid: `
    grid grid-cols-1 gap-x-[4rem] gap-y-[0.8rem]
    md:gap-y-[2rem]
    lg:grid-cols-2 lg:gap-x-[4rem] lg:gap-y-[4rem]
  `,
  fieldBlock: 'flex flex-col gap-[0.6rem] lg:flex-row lg:items-center lg:gap-[2rem]',
  fieldBlockMessage: 'lg:col-span-2 flex flex-col gap-[0.6rem] lg:flex-row lg:items-start lg:gap-[2rem]',
  label: `
    flex gap-[0.4rem] font-normal tracking-[-0.01em]
    text-[1.8rem]
    md:text-[2rem]
    lg:w-[10rem] lg:shrink-0 lg:text-[2.4rem]
  `,
  required: 'text-point-green',
  input: `
    w-full bg-white/50 text-black outline-none transition-colors duration-500 focus:bg-white
    h-[4.8rem] px-[1.2rem] text-[1.8rem]
    md:h-[6rem] md:px-[1.6rem] md:text-[2rem]
    lg:h-[7.2rem] lg:text-[2.4rem]
  `,
  textarea: `
    w-full resize-none bg-white/50 text-black outline-none transition-colors duration-500 focus:bg-white
    h-[15rem] px-[1.2rem] py-[1.2rem] text-[1.8rem]
    md:h-[18rem] md:px-[1.6rem] md:text-[2rem]
    lg:text-[2.4rem]
  `,
  submitWrap: 'mt-[1.2rem] flex w-full flex-col gap-[4rem]',
  consentLabel: `
    flex w-full items-center gap-[0.8rem] tracking-[-0.05rem]
    text-[1.8rem]
    md:text-[1.8rem]
    lg:ml-[12rem] lg:w-[calc(100%-12rem)]
  `,
  checkbox: 'h-[1.8rem] w-[1.8rem] accent-white',
  submitButton:
    'self-center h-[8rem] w-[28rem] rounded-full bg-white text-[3.2rem] font-bold text-point font-pretendard transition-colors hover:bg-white',
};

export default function ContactUsSection() {
  const { contactSection } = HOME_CONTENT;
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
        <ScrollReveal {...HOME_REVEAL.sectionTitle}>
          <h1 className={STYLE.title}>
            {contactSection.title}<span className={STYLE.titleStar}>{contactSection.titleStar}</span>
          </h1>
          <div className={STYLE.divider} />
        </ScrollReveal>

        <form onSubmit={handleSubmit} className={STYLE.form}>
          <div className={STYLE.formGrid}>
            {contactSection.fields.map((field, index) => {
              const isTextarea = field.inputType === "textarea";

              return (
                <ScrollReveal
                  key={field.name}
                  delayMs={index * 70}
                  {...HOME_REVEAL.card}
                  className={isTextarea ? STYLE.fieldBlockMessage : STYLE.fieldBlock}
                >
                  <label className={STYLE.label}>
                    {field.label}
                    {field.required ? <span className={STYLE.required}>*</span> : null}
                  </label>
                  {isTextarea ? (
                    <textarea
                      name={field.name}
                      required={field.required}
                      rows={field.rows ?? 4}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className={STYLE.textarea}
                    />
                  ) : (
                    <input
                      name={field.name}
                      type={field.type ?? "text"}
                      required={field.required}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className={STYLE.input}
                    />
                  )}
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal className={STYLE.submitWrap} delayMs={180} {...HOME_REVEAL.button}>
            <label className={STYLE.consentLabel}>
              <input type="checkbox" required className={STYLE.checkbox} />
              <span>{contactSection.consentText} <span className="font-bold">{contactSection.consentLinkLabel}</span></span>
            </label>

            <button
              type="submit"
              className={STYLE.submitButton}
            >
              {contactSection.submitButtonText}
            </button>
          </ScrollReveal>
        </form>
      </div>
    </section>
  );
}
