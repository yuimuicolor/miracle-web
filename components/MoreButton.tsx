"use client";

import { Plus } from "lucide-react";

interface ButtonProps {
  text: string;
  size?: "L" | "S";
  mode?: "light" | "dark";
  className?: string;
  onClick?: () => void;
}

export default function MoreButton({
  text,
  size = "L",
  mode = "light",
  className = "",
  onClick,
}: ButtonProps) {
  // 1. 사이즈 스타일 (사진 가이드 반영)
  const sizeStyles = {
    L: "w-[280px] h-[72px] font-en-noto-m-med", // 가이드: Notosans M (22px)
    S: "w-[200px] h-[60px] font-en-noto-s-med", // 가이드: Notosans S (18px)
  };

  // 2. 컬러 모드 스타일 (Border, Text, Hover 시 배경/색상 변화)
  const modeStyles = {
    light: `
      border-white/40 text-white 
      hover:bg-point hover:text-white
    `,
    dark: `
      border-[#6E6E6E] text-[#6E6E6E] 
      hover:bg-point hover:border-black hover:text-black
    `,
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center justify-between px-8
        border rounded-full transition-all duration-300 ease-in-out
        group uppercase
        ${sizeStyles[size]}
        ${modeStyles[mode]}
        ${className}
      `}
    >
      <span className="shrink-0">{text}</span>
      <Plus
        size={size === "L" ? 24 : 20}
        className="shrink-0 transition-transform duration-500 group-hover:rotate-90"
      />
    </button>
  );
}
