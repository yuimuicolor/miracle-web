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
    flex flex-col overflow-hidden items-center
    gap-[4rem]
    md:gap-[6rem]
    xl:grid xl:h-screen-minus-header-offset xl:grid-cols-2 xl:gap-[6rem] xl:items-stretch
  `,
  leftCol: `
    contents no-scrollbar
    xl:flex xl:size-full xl:flex-col xl:items-end xl:overflow-y-auto xl:gap-[3rem]
  `,
  thumbnailWrap:
    "order-1 xl:order-none flex w-full max-w-[70rem] flex-col items-center gap-[1.6rem]",
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
  detailImages: "order-3 flex flex-col max-w-[70rem] w-full xl:order-none",
  detailImageWrap: "w-full",

  modal:
    "fixed inset-0 z-[120] flex items-center justify-center bg-black/82 px-[2rem] py-[2rem]",
  modalInner: "relative flex items-start justify-center",
  modalImage:
    "block h-auto w-auto max-h-[calc(100vh-8rem)] max-w-[calc(100vw-10rem)] object-contain",
  modalClose:
    "absolute right-[2rem] top-[2rem] z-10 flex h-[4rem] w-[4rem] items-center justify-center rounded-full border border-white/20 bg-black/55 text-[2.4rem] leading-none text-white transition-colors duration-150 hover:bg-black/75",

  rightCol: `
    order-2 max-w-[70rem] w-full
    flex flex-col items-start justify-start
    gap-[1.2rem] md:gap-[2.4rem] lg:gap-[3.2rem]
    xl:order-none xl:h-full xl:overflow-hidden
  `,
  category: `
    font-noto text-black/60
    text-[1.8rem] leading-[130%] tracking-[-0.05em]
    lg:text-[1.8rem] lg:leading-[150%]
  `,

  brandCol: "flex flex-col gap-[0.8rem]",
  brandEn: `
    font-noto font-medium uppercase text-black tracking-[0.2em] leading-[130%]
    text-[1.6rem]
    md:text-[1.8rem]
    lg:text-[2.2rem]
  `,
  brandKoWrap: "relative overflow-hidden",
  brandKo: `
    font-noto font-bold text-black
    text-[3.2rem] leading-[120%] tracking-[-0.05em]
    md:text-[4.8rem] md:leading-[130%] md:tracking-[-0.04em]
    lg:text-[5.6rem]
  `,
  brandKoHighlight: "inline bg-point-light px-[1rem]",
  divider: `
    bg-black rounded-full
    w-[8rem] h-[0.2rem]
    md:w-[10rem] md:h-[0.4rem]
    lg:w-[10rem] lg:h-[0.6rem]
  `,
  optionRow: "flex flex-wrap items-center gap-[1.2rem]",
  optionChip: `
    border border-black px-[1.2rem] py-[0.4rem] font-noto font-medium text-black
    text-[1.8rem] leading-[130%] tracking-[-0.05em]
    lg:text-[1.8rem] lg:leading-[150%]
  `,
  desc: `
    font-noto font-medium text-black
    text-[1.8rem] leading-[150%] tracking-[-0.05em]
    lg:text-[1.8rem]
  `,
  buyButton: `
    flex h-[7.2rem] items-center justify-center rounded-full
    border border-point text-point bg-white
    font-noto font-bold text-[2.4rem] leading-[100%] tracking-[-0.05em]
    transition-colors duration-200 hover:bg-point hover:text-white
    w-full
    md:w-[30rem]
  `,
};

function ExpandIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[2.4rem] w-[2.4rem] text-white"
    >
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

  // 1. 마운트 상태 관리
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. 이미지 프리로드 (activeIndex가 바뀔 때마다 실행)
  useEffect(() => {
    const total = thumbnails.length;
    if (total <= 1) return;

    const nextIndex = (activeIndex + 1) % total;
    const prevIndex = (activeIndex - 1 + total) % total;

    [thumbnails[nextIndex], thumbnails[prevIndex]].forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [activeIndex, thumbnails]);

  // 3. 모달 관련 사이드 이펙트 (스크롤 제어 및 키보드 이벤트)
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // 모달 열리면 스크롤 방지
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow; // 모달 닫히면 스크롤 복구
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  // --- 이벤트 핸들러 ---
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
              priority={activeIndex === 0}
              quality={75}
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
              <div
                className={STYLE.modalInner}
                onClick={(event) => event.stopPropagation()}
              >
                <Image
                width={500}
                height={500}
                  src={modalSrc}
                  alt={modalAlt}
                  className={STYLE.modalImage}
                  
                />
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
