"use client";

import { Plus } from "lucide-react";

interface ButtonProps {
  text: string;
  size?: "L" | "S";
  mode?: "light" | "dark";
  className?: string;
  onClick?: () => void;
}

const STYLE = {
  base: `
    relative flex items-center justify-between px-8
    border rounded-full transition-all duration-300 ease-in-out
    group uppercase
  `,
  text: 'shrink-0',
  icon: 'shrink-0 transition-transform duration-500 group-hover:rotate-90',
  size: {
    L: 'w-[17.5rem] h-[4.5rem] font-noto font-normal text-[1.375rem] leading-[1.3] tracking-[0.2em]',
    S: 'w-[12.5rem] h-[3.75rem] font-noto font-normal text-[1.125rem] leading-[1.3] tracking-[0.2em]',
  },
  mode: {
    light: `
      border-white/40 text-white
      hover:bg-point hover:text-white
    `,
    dark: `
      border-[#6E6E6E] text-[#6E6E6E]
      hover:bg-point hover:border-black hover:text-black
    `,
  },
};

export default function MoreButton({
  text,
  size = "L",
  mode = "light",
  className = "",
  onClick,
}: ButtonProps) {
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
      <Plus
        size={size === "L" ? 24 : 20}
        className={STYLE.icon}
      />
    </button>
  );
}
