"use client";

import { useState, ChangeEvent, SyntheticEvent } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { HOME_REVEAL } from "@/components/sections/homeMotion";
import { sendContactEmail } from "@/app/actions";
import TextModal from "../TextModal";
import { useSettings } from "@/context/SiteSettingsContext";
import { ContactData } from "@/lib/contactsData";

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
    lg:w-[10rem] lg:shrink-0 lg:text-[2rem]
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
const FIELDS: Array<{
  id: string; 
  name: keyof ContactInput;
  label: string;
  required?: boolean;
  type?: string;
  isTextarea?: boolean;
}> = [
  { id: "contact_u_name", name: "name", label: "이름", required: true },
  { id: "contact_u_phone", name: "phone", label: "전화번호", type: "tel" },
  { id: "contact_u_email", name: "email", label: "이메일", type: "email", required: true },
  { id: "contact_u_company", name: "company", label: "회사명" },
  { id: "contact_u_msg", name: "message", label: "문의내용", required: true, isTextarea: true },
];


type ContactInput = Pick<
  ContactData,
  "name" | "phone" | "email" | "company" | "message"
>;


export default function ContactUsSection() {
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  // 2. 초기값에는 사용자 입력 항목만 넣기
  const [formData, setFormData] = useState<ContactInput>({
    name: "",
    phone: "",
    email: "",
    company: "",
    message: "",
  });
  const settings = useSettings();

const handleChange = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name as keyof ContactInput]: value }));
};

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 유효성 검사 로직 (공백 제거 포함)
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      return alert("필수 항목을 입력해주세요.");
    }

    try {
      const result = await sendContactEmail(formData);
      if (result.success) {
        alert("접수되었습니다!");
        setFormData({
          name: "",
          phone: "",
          email: "",
          company: "",
          message: "",
        });
      }
    } catch (error) {
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <>
      <section className={STYLE.section}>
        <div className={STYLE.inner}>
          <ScrollReveal {...HOME_REVEAL.sectionTitle}>
            <h1 className={STYLE.title}>
              Contact Us
              <span className={STYLE.titleStar}>*</span>
            </h1>
            <div className={STYLE.divider} />
          </ScrollReveal>

          <form onSubmit={handleSubmit} className={STYLE.form}>
            <div className={STYLE.formGrid}>
              {FIELDS.map((field, index) => {
                const isTextarea = field.isTextarea;

                return (
                  <ScrollReveal
                    key={field.id}
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
                        id={field.id}
                        name={String(field.name)}
                        required={field.required}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className={STYLE.textarea}
                      />
                    ) : (
                      <input
                        id={field.id}
                        name={String(field.name)}
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
                  <span>(필수) 아래 개인정보 이용 정책에 동의합니다.</span>
                </label>
                <span
                  className={STYLE.consentLink}
                  onClick={() => setIsTextModalOpen(true)}
                >
                  [전문보기]
                </span>
              </div>

              <button type="submit" className={STYLE.submitButton}>
                제출
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
        content={
          settings?.privacyPolicyText ||
          "개인정보 이용 정책 전문을 불러올 수 없습니다."
        }
      />
    </>
  );
}
