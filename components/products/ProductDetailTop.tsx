"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useRef, useState } from "react";
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
    "relative w-full aspect-[1/1] overflow-hidden bg-black/5",
  thumbnailImage: "object-cover",
  arrowButton: `
    absolute top-1/2 z-[3] flex h-[6rem] w-[6rem] -translate-y-1/2 items-center justify-center
    text-white/90 transition-colors duration-200 hover:text-white
  `,
  arrowLeft: "left-[1.2rem]",
  arrowRight: "right-[1.2rem]",
  dotRow: "flex items-center justify-center gap-[0.8rem]",
  dot: "h-[0.8rem] w-[0.8rem] rounded-full bg-black/30 transition-colors duration-200",
  dotActive: "bg-point",
  detailImages: "flex flex-col  max-w-[70rem] ",
  detailImageWrap: "w-full",

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

export default function ProductDetailTop({ product }: ProductDetailTopProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const dragStartXRef = useRef<number | null>(null);

  const thumbnails =
    product.thumbnailImages.length > 0
      ? product.thumbnailImages
      : [product.image];

  const detailImages =
    product.detailImages.length > 0 ? product.detailImages : [product.image];

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
    </div>
  );
}
