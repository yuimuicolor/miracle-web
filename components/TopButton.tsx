"use client";

const STYLE = {
  button: `fixed right-[1.6rem] bottom-16 z-70 flex h-32 w-32 flex-col items-center justify-center
    rounded-full border border-white/35 bg-black/70 text-white backdrop-blur-xs transition-colors
    hover:bg-black/85
    md:right-16 md:bottom-16 lg:right-24 lg:bottom-24`,
  arrow: "text-[1.6rem] leading-none",
  label: "mt-[0.4rem] text-[1.8rem] leading-none tracking-[0.2em]",
};

export default function TopButton() {
  return (
    <button
      type="button"
      aria-label="맨 위로 이동"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={STYLE.button}
    >
      <span className={STYLE.arrow}>▲</span>
      <span className={STYLE.label}>TOP</span>
    </button>
  );
}
