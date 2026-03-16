"use client";

export default function TopButton() {
  return (
    <button
      type="button"
      aria-label="맨 위로 이동"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-[4rem] right-[1.6rem] z-[70] flex flex-col items-center justify-center
      h-[8rem] w-[8rem]  rounded-full border border-white/35 bg-black/70 text-white
      backdrop-blur-[4px] transition-colors hover:bg-black/85
      
      md:bottom-[4rem] md:right-[4rem]
      lg:bottom-[6rem] lg:right-[6rem]"
    >
      <span className="text-[1.6rem] leading-none">▲</span>
      <span className="mt-[0.4rem] text-[1.8rem] leading-none tracking-[0.2em]">TOP</span>
    </button>
  );
}
