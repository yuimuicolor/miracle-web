"use client";

import { useState } from "react";
import { useSettings } from "@/context/SiteSettingsContext";
import { getDesktopRows, getFooterData } from "@/lib/footerData";
import TextModal from "./TextModal";
import Logo from "./sections/common/Logo";

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
  policy:
    "text-[1.8rem] text-white/70 underline decoration-white/40 underline-offset-2",
};

export default function Footer() {
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const settings = useSettings();
  if (!settings) return null;

  const footerData = getFooterData(settings);
  const desktopRows = getDesktopRows(footerData.items);

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
            {footerData.items.map((item) =>
              renderInfoItem(item.label, item.value, true),
            )}
          </div>
          <p className={STYLE.policy}>
            <span
              className="cursor-pointer border-b border-transparent hover:border-gray-400 transition-all"
              onClick={() => setIsTextModalOpen(true)}
            >
              개인정보처리방침
            </span>
          </p>
        </div>
      </footer>
      <TextModal
        isOpen={isTextModalOpen}
        onClose={() => setIsTextModalOpen(false)}
        title="개인정보처리방침"
        content={ settings.privacyPolicyText || "개인정보처리방침 내용이 없습니다." }
      />
    </>
  );
}
