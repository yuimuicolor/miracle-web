"use client";

import { ChevronRight, Plus } from "lucide-react";

interface ButtonProps {
  text: string;
  size?: "L" | "S";
  mode?: "light" | "dark";
  icon?: "plus" | "chevron-right";
  className?: string;
  onClick?: () => void;
}

const STYLE = {
  base: `
    relative group flex items-center justify-between uppercase
    rounded-full border px-[3rem]
    transition-all duration-300 ease-in-out
  `,
  text: 'shrink-0',
  icon: 'shrink-0 transition-transform duration-500 group-hover:rotate-90',
  size: {
    L: 'h-[7.2rem] w-[28rem] font-noto text-[2.2rem] font-normal leading-[1.3] tracking-[0.2em]',
    S: 'h-[6rem] w-[20rem] font-noto text-[1.8rem] font-normal leading-[1.3] tracking-[0.2em]',
  },
  mode: {
    light: `
      border-white/40 text-white
      hover:bg-hover/70 hover:text-white
    `,
    dark: `
      border-[#6E6E6E] text-[#6E6E6E]
      hover:bg-hover/70 hover:border-black hover:text-black
    `,
  },
};

export default function MoreButton({
  text,
  size = "L",
  mode = "light",
  icon = "plus",
  className = "",
  onClick,
}: ButtonProps) {
  const iconSize = size === "L" ? 24 : 20;

  return (
    <button
      onClick={onClick}
      className={`
        ${STYLE.base}
        ${STYLE.size[size]}
        ${STYLE.mode[mode]}
        ${className}
      `}
    >
      <span className={STYLE.text}>{text}</span>
      {icon === "chevron-right" ? (
        <ChevronRight size={iconSize} className={STYLE.icon} />
      ) : (
        <Plus size={iconSize} className={STYLE.icon} />
      )}
    </button>
  );
}
