"use client";

import { useState, useEffect } from "react";

const STYLE = {
  button: `
    fixed z-70 flex h-32 w-32 flex-col items-center justify-center
    right-[1.6rem] bottom-16
    rounded-full border border-white/35 bg-black/70 text-white backdrop-blur-xs transition-all duration-300
    hover:bg-black/85
    md:right-16 md:bottom-16
    lg:right-24 lg:bottom-24
  `,
  arrow: "text-[1.8rem] leading-none",
  label: "mt-[0.4rem] text-[1.8rem] leading-none tracking-[0.2em]",
};

export default function TopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500); // 500px 이상 스크롤 시 버튼 표시
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="맨 위로 이동"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`${STYLE.button} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <span className={STYLE.arrow}>▲</span>
      <span className={STYLE.label}>TOP</span>
    </button>
  );
}
