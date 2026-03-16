"use client";

export default function TopButton() {
  return (
    <button
      type="button"
      aria-label="맨 위로 이동"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-[2rem] right-[2rem] z-[70] flex h-[4.8rem] w-[4.8rem] flex-col items-center justify-center rounded-full border border-white/35 bg-black/70 text-white backdrop-blur-[4px] transition-colors hover:bg-black/85 md:bottom-[2.4rem] md:right-[2.4rem]"
    >
      <span className="text-[1.2rem] leading-none">▲</span>
      <span className="mt-[0.2rem] text-[0.9rem] leading-none tracking-[0.2em]">TOP</span>
    </button>
  );
}
