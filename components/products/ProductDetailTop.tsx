"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ProductItem } from "@/lib/productsData";

interface ProductDetailTopProps {
  product: ProductItem;
}

const DRAG_THRESHOLD = 28;

const STYLE = {
  topContainer: `
    grid h-screen-minus-header-offset grid-cols-2 gap-[6rem] overflow-hidden
  `,
  leftCol: `
    no-scrollbar flex size-full flex-col items-end overflow-y-auto
    gap-[3rem]
  `,
  thumbnailWrap: "flex w-full max-w-[70rem]  flex-col items-center gap-[1.6rem]",
  thumbnailMain:
    "group relative w-full aspect-[1/1] overflow-hidden bg-black/5",
  thumbnailImage: "object-cover",
  imageHoverShade:
    "pointer-events-none absolute inset-0 z-[4] backdrop-blur-[4px] bg-black/50 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100",
  imageExpandBadge:
    "pointer-events-none absolute right-[2rem] top-[2rem] z-[8] flex h-[4rem] w-[4rem] items-center justify-center rounded-full bg-white/12 opacity-0 backdrop-blur-[10px] transition-opacity duration-150 ease-out group-hover:opacity-100",
  imageExpandButton:
    "absolute right-[2rem] top-[2rem] z-[9] flex h-[4rem] w-[4rem] items-center justify-center rounded-full",
  arrowButton: `
    absolute top-1/2 z-[7] flex h-[6rem] w-[6rem] -translate-y-1/2 items-center justify-center
    text-white/90 transition-colors duration-200 hover:text-white
  `,
  arrowLeft: "left-[1.2rem]",
  arrowRight: "right-[1.2rem]",
  dotRow: "flex items-center justify-center gap-[0.8rem]",
  dot: "h-[0.8rem] w-[0.8rem] rounded-full bg-black/30 transition-colors duration-200",
  dotActive: "bg-point",
  detailImages: "flex flex-col  max-w-[70rem] ",
  detailImageWrap: "w-full",

  modal: "fixed inset-0 z-[120] flex items-center justify-center bg-black/82 px-[2rem] py-[2rem]",
  modalInner: "relative flex items-start justify-center",
  modalImage:
    "block h-auto w-auto max-h-[calc(100vh-8rem)] max-w-[calc(100vw-10rem)] object-contain",
  modalClose:
    "absolute right-[2rem] top-[2rem] z-10 flex h-[4rem] w-[4rem] items-center justify-center rounded-full border border-white/20 bg-black/55 text-[2.4rem] leading-none text-white transition-colors duration-150 hover:bg-black/75",

  rightCol: `
    max-w-[70rem] h-full overflow-hidden
    flex flex-col gap-[3.2rem] items-start justify-start
  `,
  category:
    "font-noto text-[1.8rem] leading-[150%] tracking-[-0.05em] text-black/60",

  brandCol: "flex flex-col gap-[0.8rem]",
  brandEn:
    "font-noto font-medium text-[2.2rem] leading-[130%] tracking-[0.2em] text-black uppercase",
  brandKoWrap: "relative overflow-hidden",
  brandKo:
    "font-noto font-bold text-[5.6rem] leading-[130%] tracking-[-0.04em] text-black",
  brandKoHighlight: "inline bg-point-light px-[1rem]",
  divider: "h-[0.6rem] w-[10rem] bg-black rounded-full",
  optionRow: "flex flex-wrap items-center gap-[1.2rem]",
  optionChip:
    "border border-black px-[1.2rem] py-[0.4rem] font-noto text-[1.8rem] font-medium leading-[150%] tracking-[-0.05em] text-black",
  desc: " font-noto text-[1.8rem] font-medium leading-[150%] tracking-[-0.05em] text-black",
  buyButton: `flex h-[7.2rem] w-[30rem] items-center justify-center rounded-full
    border border-point text-point bg-white
    font-noto font-bold text-[2.4rem] leading-[100%] tracking-[-0.05em]
    transition-colors duration-200 hover:bg-point hover:text-white
  `,
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

export default function ProductDetailTop({ product }: ProductDetailTopProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState("");
  const [modalAlt, setModalAlt] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const dragStartXRef = useRef<number | null>(null);

  const thumbnails =
    product.thumbnailImages.length > 0
      ? product.thumbnailImages
      : [product.image];

  const detailImages =
    product.detailImages.length > 0 ? product.detailImages : [product.image];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const openZoomModal = (src: string, alt: string) => {
    setModalSrc(src);
    setModalAlt(alt);
    setIsModalOpen(true);
  };

  const moveSlide = (direction: "prev" | "next") => {
    const total = thumbnails.length;
    if (total <= 1) return;

    setActiveIndex((prev) => {
      const next = direction === "next" ? prev + 1 : prev - 1;
      return (next + total) % total;
    });
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    dragStartXRef.current = event.clientX;
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null) return;

    const deltaX = event.clientX - dragStartXRef.current;
    dragStartXRef.current = null;

    if (Math.abs(deltaX) < DRAG_THRESHOLD) return;
    moveSlide(deltaX < 0 ? "next" : "prev");
  };

  return (
    <div className={STYLE.topContainer}>
      <div className={STYLE.leftCol}>
        <div className={STYLE.thumbnailWrap}>
          <div
            className={STYLE.thumbnailMain}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            <Image
              src={thumbnails[activeIndex]}
              alt={`${product.brandKo} 썸네일 ${activeIndex + 1}`}
              fill
              priority
              draggable={false}
              sizes="50vw"
              className={STYLE.thumbnailImage}
            />

            <div className={STYLE.imageHoverShade} />
            <div className={STYLE.imageExpandBadge}>
              <ExpandIcon />
            </div>
            <button
              type="button"
              className={STYLE.imageExpandButton}
              aria-label="썸네일 확대 보기"
              onClick={() =>
                openZoomModal(
                  thumbnails[activeIndex],
                  `${product.brandKo} 썸네일 ${activeIndex + 1}`,
                )
              }
            />

            <button
              type="button"
              className={`${STYLE.arrowButton} ${STYLE.arrowLeft}`}
              aria-label="이전 썸네일"
              onClick={() => moveSlide("prev")}
            >
              <ChevronLeft size={40} />
            </button>

            <button
              type="button"
              className={`${STYLE.arrowButton} ${STYLE.arrowRight}`}
              aria-label="다음 썸네일"
              onClick={() => moveSlide("next")}
            >
              <ChevronRight size={40} />
            </button>
          </div>

          <div className={STYLE.dotRow}>
            {thumbnails.map((_, index) => (
              <button
                key={`dot-${index}`}
                type="button"
                aria-label={`썸네일 ${index + 1} 보기`}
                onClick={() => setActiveIndex(index)}
                className={`${STYLE.dot} ${index === activeIndex ? STYLE.dotActive : ""}`}
              />
            ))}
          </div>
        </div>

        <div className={STYLE.detailImages}>
          {detailImages.map((src, index) => (
            <div key={`${src}-${index}`} className={STYLE.detailImageWrap}>
              <Image
                src={src}
                alt={`${product.brandKo} 상세 이미지 ${index + 1}`}
                width={0}
                height={0}
                sizes="50vw"
                draggable={false}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={STYLE.rightCol}>
        <p className={STYLE.category}>{product.category}</p>

        <div className={STYLE.brandCol}>
          <p className={STYLE.brandEn}>{product.brandEn}</p>
          <div className={STYLE.brandKoWrap}>
            <h1 className={STYLE.brandKo}>
              <span className={STYLE.brandKoHighlight}>{product.brandKo}</span>
            </h1>
          </div>
        </div>

        <div className={STYLE.divider} />

        {product.options.length > 0 ? (
          <div className={STYLE.optionRow}>
            {product.options.map((option, index) => (
              <span key={`${option}-${index}`} className={STYLE.optionChip}>
                {option}
              </span>
            ))}
          </div>
        ) : null}

        <p className={STYLE.desc}>{product.desc}</p>

        <a
          href={product.purchaseLink}
          target="_blank"
          rel="noopener noreferrer"
          className={STYLE.buyButton}
        >
          <span className="flex items-center gap-[0.6rem]">
            구매하러 가기
            <ExternalLink size={20} strokeWidth={2} />
          </span>
        </a>
      </div>

      {isMounted && isModalOpen
        ? createPortal(
            <div
              className={STYLE.modal}
              onClick={() => setIsModalOpen(false)}
              role="dialog"
              aria-modal="true"
            >
              <div className={STYLE.modalInner} onClick={(event) => event.stopPropagation()}>
                <img src={modalSrc} alt={modalAlt} className={STYLE.modalImage} />
                <button
                  type="button"
                  className={STYLE.modalClose}
                  onClick={() => setIsModalOpen(false)}
                  aria-label="상세 이미지 닫기"
                >
                  ×
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
