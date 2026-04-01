"use client";

import { useState } from "react";
import { useSettings } from "@/context/SiteSettingsContext";
import TextModal from "./TextModal";
import Logo from "./sections/common/Logo";
import { getDesktopRows, getFooterItems } from "@/lib/config/footerConfig";

const STYLE = {
  root: `
    w-full min-h-[43rem] border-t border-white/10 bg-[#4a4a4a] text-white/90
    md:h-[40rem]
    lg:h-[45rem]
  `,
  inner: `
    flex min-h-[43rem] w-full flex-col justify-center gap-[3.2rem]
    px-[1.6rem] py-[3.2rem]
    md:h-full md:px-[4rem] md:py-0
    lg:gap-[4rem] lg:px-[8rem]
  `,
  desktopInfoWrap: "hidden flex-col gap-[1.2rem] text-[1.8rem] md:flex",
  desktopRow: "flex flex-wrap items-center gap-x-[3rem]",
  desktopItem: "flex items-center gap-[0.8rem]",
  desktopLabel: "text-white/70",
  desktopValue: "text-white",
  mobileInfoWrap: "flex flex-col gap-[1.2rem] text-[1.8rem] md:hidden",
  mobileItem: "flex items-start justify-start gap-[0.8rem]",
  mobileLabel: "text-white/70",
  mobileValue: "text-white",
  policyWrap: "flex flex-col items-start gap-[1.2rem]",
  policy:
    "text-[1.8rem] text-white",
  recaptchaNoticeWrap: "text-[1.2rem] text-white/50 gap-x-[0.4rem] flex items-center [&_a]:underline [&_a]:underline-offset-4",
};

export default function Footer() {
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const settings = useSettings();
  if (!settings) return null;

  const footerItems = getFooterItems(settings);
  const desktopRows = getDesktopRows(footerItems);

  const renderInfoItem = (label: string, value: string, mobile = false) => (
    <div key={label} className={mobile ? STYLE.mobileItem : STYLE.desktopItem}>
      <span className={mobile ? STYLE.mobileLabel : STYLE.desktopLabel}>
        {label}
      </span>
      <span className={mobile ? STYLE.mobileValue : STYLE.desktopValue}>
        {value}
      </span>
    </div>
  );

  return (
    <>
      <footer className={STYLE.root}>
        <div className={STYLE.inner}>
          <Logo />
          <div className={STYLE.desktopInfoWrap}>
            {desktopRows.map((row, rowIndex) => (
              <div key={rowIndex} className={STYLE.desktopRow}>
                {row.map((item) => renderInfoItem(item.label, item.value))}
              </div>
            ))}
          </div>
          <div className={STYLE.mobileInfoWrap}>
            {footerItems.map((item) =>
              renderInfoItem(item.label, item.value, true),
            )}
          </div>
          <div className={STYLE.policyWrap}>
            <div
              className={STYLE.policy}
              onClick={() => setIsTextModalOpen(true)}
            >
              개인정보처리방침
            </div>
            <div className={STYLE.recaptchaNoticeWrap}>
              This site is protected by reCAPTCHA and the Google
              <a href="https://policies.google.com/privacy">
                Privacy Policy
              </a>{" "}
              and
              <a href="https://policies.google.com/terms">
                Terms of Service
              </a>{" "}
              apply.
            </div>
          </div>
        </div>
      </footer>
      <TextModal
        isOpen={isTextModalOpen}
        onClose={() => setIsTextModalOpen(false)}
        title="개인정보처리방침"
        content={
          settings.privacyPolicyText || "개인정보처리방침 내용이 없습니다."
        }
      />
    </>
  );
}
