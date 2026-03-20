"use client";

import { useEffect, useState, ChangeEvent, SyntheticEvent } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { HOME_REVEAL } from "@/components/sections/homeMotion";
import { ContactData } from "@/types/contact";
import { sendContactEmail } from "@/app/actions";
import { HOME_CONTENT } from "@/lib/siteData";
import TextModal from "../TextModal";
import { useSettings } from "@/context/SiteSettingsContext";

const STYLE = {
  section: `
    bg-point
    px-[1.6rem] pt-[10rem] pb-[8rem]
    md:px-[4rem] md:pt-[14rem]
    lg:px-[8rem] lg:pt-[17rem] lg:min-h-screen
  `,
  inner: "mx-auto",
  title: `
    font-gilda uppercase leading-none text-white
    text-[3.6rem]
    md:text-[5.6rem]
    lg:text-[6.4rem]
    xl:text-[8rem]
  `,
  titleStar: "text-point-light",
  divider: `
    w-full h-px bg-white
    mt-[1rem] mb-[2rem]
    md:mt-[2rem] md:mb-[4rem]
    xl:mb-[6rem]
  `,
  form: "w-full",
  formGrid: `
    grid grid-cols-1 gap-x-[4rem] gap-y-[0.8rem]
    md:gap-y-[2rem]
    lg:grid-cols-2 lg:gap-x-[6rem] lg:gap-y-[2.8rem]
    xl:gap-x-[12rem]
  `,
  fieldBlock:
    "flex flex-col gap-[0.6rem] lg:flex-row lg:items-center lg:gap-[2rem]",
  fieldBlockMessage:
    "lg:col-span-2 flex flex-col gap-[0.6rem] lg:flex-row lg:items-start lg:gap-[2rem]",
  label: `
    flex gap-[0.4rem] font-normal tracking-[-0.01em]
    text-[1.8rem]
    lg:w-[8rem] lg:shrink-0 lg:text-[2rem]
  `,
  required: "text-point-green",
  input: `
    w-full bg-white/50 text-black outline-none transition-colors duration-500 focus:bg-white
    h-[4.4rem] px-[1.2rem] text-[1.8rem]
    md:h-[4.8rem] md:px-[1.6rem]
    lg:h-[5.2rem] lg:text-[2rem]
  `,
  textarea: `
    w-full resize-none bg-white/50 text-black outline-none transition-colors duration-500 focus:bg-white
    h-[15rem] px-[1.2rem] py-[1.2rem] text-[1.8rem]
    md:h-[18rem] md:px-[1.6rem] lg:text-[2rem]
  `,
  submitWrap: "mt-[1.2rem] flex w-full flex-col gap-[4rem]",
  consentContainer: "flex flex-col items-start md:flex-row gap-[0.8rem]",
  consentLabel: `
    flex cursor-pointer items-center gap-[0.6rem] font-normal
    tracking-[-0.05rem]
    text-[1.8rem]
    lg:ml-[12rem] 
  `,
  checkbox: "h-[1.8rem] w-[1.8rem] accent-white",
  consentLink: `ml-[2.4rem] font-bold border-b border-white cursor-pointer  transition-colors md:ml-0 `,
  submitButton:
    "self-center h-[8rem] w-full max-w-[28rem] rounded-full bg-white text-[3.2rem] font-bold text-point font-pretendard transition-colors hover:bg-white",
};

export default function ContactUsSection() {
  const { contactSection } = HOME_CONTENT;
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);

  const settings = useSettings();
  if (!settings) {
    return null; // 또는 로딩 스피너 등
  }

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

  /**
   * 고객 문의 폼 제출 핸들러
   * Supabase 데이터베이스에 입력을 저장하고 사용자에게 피드백을 제공합니다.
   */
  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력 데이터 전처리 및 유효성 검사 (필수 필드 공백 제거 등)
    const submitData: ContactData = {
      ...formData,
      company: formData.company?.trim() || "",
      message: formData.message.trim(),
    };

    // 필수 입력값 검증 (클라이언트측 2차 검증)
    if (!submitData.name || !submitData.email || !submitData.message) {
      alert("필수 입력 항목을 모두 작성해 주세요.");
      return;
    }

    try {
      // 🚀 1. 서버 액션 호출 (이 함수 하나가 DB저장 + 메일발송 다 함)
      const result = await sendContactEmail(submitData);

      if (!result.success) {
        throw new Error("서버에서 처리에 실패했습니다.");
      }

      // 2. 성공 시 UI 처리
      alert(
        "문의가 성공적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.",
      );

      setFormData({
        name: "",
        phone: "",
        email: "",
        company: "",
        message: "",
      });
    } catch (error) {
      console.error("[Contact Error]:", error);
      alert("전송 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <section className={STYLE.section}>
        <div className={STYLE.inner}>
          <ScrollReveal {...HOME_REVEAL.sectionTitle}>
            <h1 className={STYLE.title}>
              {contactSection.title}
              <span className={STYLE.titleStar}>
                {contactSection.titleStar}
              </span>
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
                    className={
                      isTextarea ? STYLE.fieldBlockMessage : STYLE.fieldBlock
                    }
                  >
                    <label className={STYLE.label}>
                      {field.label}
                      {field.required ? (
                        <span className={STYLE.required}>*</span>
                      ) : null}
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

            <ScrollReveal
              className={STYLE.submitWrap}
              delayMs={180}
              {...HOME_REVEAL.button}
            >
              <div className={STYLE.consentContainer}>
                <label className={STYLE.consentLabel}>
                  <input type="checkbox" required className={STYLE.checkbox} />
                  <span>{contactSection.consentText}</span>
                </label>
                <span
                  className={STYLE.consentLink}
                  onClick={() => setIsTextModalOpen(true)}
                >
                  {contactSection.consentLinkLabel}
                </span>
              </div>

              <button type="submit" className={STYLE.submitButton}>
                {contactSection.submitButtonText}
              </button>
            </ScrollReveal>
          </form>
        </div>
      </section>

      {/* 텍스트 모달 호출 */}
      <TextModal
        isOpen={isTextModalOpen}
        onClose={() => setIsTextModalOpen(false)}
        title={"개인정보 이용 정책 전문"}
        content={settings?.privacyPolicyText || "개인정보 이용 정책 전문을 불러올 수 없습니다."}
      />
    </>
  );
}
