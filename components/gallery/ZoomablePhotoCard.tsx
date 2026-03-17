"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ZoomablePhotoCardProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  mode?: "default" | "with-title";
  subtitle?: string;
  mainTitle?: string;
}

const TWO_LINE_CLAMP_STYLE = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical" as const,
  WebkitLineClamp: 2,
  overflow: "hidden",
};

const MAIN_TITLE_CLAMP_STYLE = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical" as const,
  WebkitLineClamp: 2,
  overflow: "hidden",
  paddingBottom: "0.1em",
};

const STYLE = {
  card: "group relative aspect-square overflow-hidden bg-black/20",
  image:
    "object-cover transform-gpu transition-transform duration-150 ease-out will-change-transform group-hover:scale-[1.035]",
  hoverBlur:
    "pointer-events-none absolute inset-0 scale-[1.02] opacity-0 blur-[7px] transform-gpu transition-[opacity,transform,filter] duration-150 ease-out will-change-[opacity,transform,filter] group-hover:scale-[1.06] group-hover:opacity-100",
  hoverShade:
    "pointer-events-none absolute inset-0 z-[6] bg-black/12 opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100",
  expandBadge:
    "pointer-events-none absolute right-[2rem] top-[2rem] z-[10] flex h-[4rem] w-[4rem] items-center justify-center rounded-full bg-white/12 opacity-0 backdrop-blur-[10px] transition-opacity duration-150 ease-out group-hover:opacity-100",
  textWrap:
    "absolute bottom-[1.2rem] left-[1.2rem] z-[2] flex w-[calc(100%-2.4rem)] flex-col gap-[0.4rem] text-left text-white",
  subtitle: `
    font-noto uppercase leading-[1.3] tracking-[0.2em] text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]
    text-[1.2rem]
    md:text-[1.2rem]
    lg:text-[1.8rem]
  `,
  mainTitle:
    `font-noto text-[2.4rem] tracking-[-0.05em] leading-[1.3]
    md:text-[2.0rem] md:leading-[1.5] xl:text-[3.2rem] lg:leading-[1.25]
    text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)]`,
  modal: "fixed inset-0 z-[120] flex items-center justify-center bg-black/82 px-[2rem] py-[2rem]",
  modalInner: "relative flex items-start justify-center",
  modalImage:
    "block h-auto w-auto max-h-[calc(100vh-8rem)] max-w-[calc(100vw-10rem)] object-contain",
  modalClose:
    "absolute right-[2rem] top-[2rem] z-10 flex h-[4rem] w-[4rem] items-center justify-center rounded-full border border-white/20 bg-black/55 text-[2.4rem] leading-none text-white transition-colors duration-150 hover:bg-black/75",
};

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[2.4rem] w-[2.4rem] text-white">
      <path
        d="M13 4h7v7h-2.8V8.78l-5.96 5.96-1.98-1.98 5.96-5.96H13V4Z"
        fill="currentColor"
      />
      <path
        d="M11 20H4v-7h2.8v2.22l5.96-5.96 1.98 1.98-5.96 5.96H11V20Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function ZoomablePhotoCard({
  src,
  alt,
  sizes = "(max-width: 767px) 44vw, 30vw",
  className = "",
  mode = "default",
  subtitle,
  mainTitle,
}: ZoomablePhotoCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className={`${STYLE.card} ${className}`.trim()}
        onClick={() => setIsOpen(true)}
        aria-label={`${alt} 확대 보기`}
      >
        <Image src={src} alt={alt} fill sizes={sizes} className={STYLE.image} />
        {mode === "with-title" && subtitle && mainTitle ? (
          <div className={STYLE.textWrap}>
            <p className={STYLE.subtitle} style={TWO_LINE_CLAMP_STYLE}>
              {subtitle}
            </p>
            <p className={STYLE.mainTitle} style={MAIN_TITLE_CLAMP_STYLE}>
              {mainTitle}
            </p>
          </div>
        ) : null}
        <div className={STYLE.hoverBlur}>
          <Image src={src} alt="" fill sizes={sizes} className="object-cover" aria-hidden="true" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/50" />
        </div>
        <div className={STYLE.hoverShade} />
        <div className={STYLE.expandBadge}>
          <ExpandIcon />
        </div>
      </button>

      {isMounted && isOpen
        ? createPortal(
            <div className={STYLE.modal} onClick={() => setIsOpen(false)} role="dialog" aria-modal="true">
              <div className={STYLE.modalInner} onClick={(event) => event.stopPropagation()}>
                <img src={src} alt={alt} className={STYLE.modalImage} />
                <button
                  type="button"
                  className={STYLE.modalClose}
                  onClick={() => setIsOpen(false)}
                  aria-label="갤러리 이미지 닫기"
                >
                  ×
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}