"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import MoreButton from "@/components/MoreButton";
import { PRODUCTS, toProductPathId } from "@/lib/productsData";
import ProductBox from "./ProductBox";

const STYLE = {
  section: `
    w-full bg-bg-light
    pt-[8rem] md:pt-[10rem] lg:pt-[12rem]
  `,
  content: "mx-auto flex w-full flex-col gap-[4rem] md:gap-[5rem]",
  titleWrap: "flex items-center gap-[2rem]",
  title: `
    shrink-0 font-gilda text-[5.6rem] font-normal uppercase
    leading-[1.2] tracking-[-0.05em] text-black
  `,
  star: "leading-[1.2] text-point pl-[0.2em]",
  divider: "h-[0.1rem] w-full flex-1 bg-black",
  sliderArea: "flex items-center gap-[1.2rem] md:gap-[1.6rem]",
  track: `
    no-scrollbar flex flex-1 overflow-x-auto py-[1.5rem]
    gap-[1.2rem]
    md:gap-[2rem]
  `,
  cardWrap: "w-[24rem] shrink-0 md:w-[30rem]",
  cardLink: "block",
  arrowButton:
    "shrink-0 text-[5rem] leading-none text-black/20 transition-colors hover:text-black/45 md:text-[6rem]",
  buttonWrap: "flex justify-center pt-[1rem]",
};

interface OtherProductsSliderProps {
  currentProductId: string;
}

export default function OtherProductsSlider({ currentProductId }: OtherProductsSliderProps) {
  const ARROW_SCROLL_DURATION = 420;

  const products = useMemo(
    () => PRODUCTS.filter((item) => item.id !== currentProductId),
    [currentProductId],
  );

  const trackRef = useRef<HTMLDivElement | null>(null);
  const [grabbing, setGrabbing] = useState(false);

  const halfRef = useRef(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const dragMovedRef = useRef(false);
  const arrowAnimRef = useRef<number>(0);

  const normalizeScroll = (value: number, half: number) => {
    if (half <= 0) return value;
    return ((value % half) + half) % half;
  };

  const calcHalf = (container: HTMLDivElement) => {
    const cards = container.querySelectorAll<HTMLElement>("[data-product-card='true']");
    halfRef.current = cards[products.length]?.offsetLeft ?? container.scrollWidth / 2;
  };

  useEffect(() => {
    const container = trackRef.current;
    if (!container || products.length === 0) return;

    const ro = new ResizeObserver(() => calcHalf(container));
    ro.observe(container);

    requestAnimationFrame(() => calcHalf(container));

    return () => {
      if (arrowAnimRef.current) {
        cancelAnimationFrame(arrowAnimRef.current);
      }
      ro.disconnect();
    };
  }, [products]);

  const stopArrowAnimation = () => {
    if (!arrowAnimRef.current) return;
    cancelAnimationFrame(arrowAnimRef.current);
    arrowAnimRef.current = 0;
  };

  const animateScrollBy = (delta: number) => {
    const container = trackRef.current;
    if (!container) return;

    const half = halfRef.current;
    const startLeft = container.scrollLeft;
    const startTime = performance.now();

    stopArrowAnimation();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / ARROW_SCROLL_DURATION, 1);
      const eased = 1 - (1 - progress) ** 3;
      container.scrollLeft = normalizeScroll(startLeft + delta * eased, half);

      if (progress < 1) {
        arrowAnimRef.current = requestAnimationFrame(tick);
      } else {
        arrowAnimRef.current = 0;
      }
    };

    arrowAnimRef.current = requestAnimationFrame(tick);
  };

  const scrollByCard = (direction: "prev" | "next") => {
    const container = trackRef.current;
    if (!container) return;

    const firstCard = container.querySelector<HTMLElement>("[data-product-card='true']");
    if (!firstCard) return;

    const gap = Number.parseFloat(getComputedStyle(container).columnGap || "0") || 0;
    const step = firstCard.offsetWidth + gap;
    animateScrollBy(direction === "next" ? step : -step);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = trackRef.current;
    if (!container) return;
    stopArrowAnimation();
    isDragging.current = true;
    dragMovedRef.current = false;
    setGrabbing(true);
    dragStartX.current = e.pageX - container.getBoundingClientRect().left;
    dragScrollLeft.current = container.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const container = trackRef.current;
    if (!container) return;
    const half = halfRef.current;
    const x = e.pageX - container.getBoundingClientRect().left;

    if (Math.abs(x - dragStartX.current) > 6) {
      dragMovedRef.current = true;
    }

    const newLeft = dragScrollLeft.current - (x - dragStartX.current) * 1.8;
    container.scrollLeft = normalizeScroll(newLeft, half);
  };

  const handleCardClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!dragMovedRef.current) return;
    event.preventDefault();
    dragMovedRef.current = false;
  };

  const handleNativeDragStart = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
  };

  const stopDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setGrabbing(false);
  };

  const handleTrackMouseLeave = () => {
    stopDrag();
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <section className={STYLE.section}>
      <div className={STYLE.content}>
        <div className={STYLE.titleWrap}>
          <h3 className={STYLE.title}>
            OTHER PRODUCTS<span className={STYLE.star}>*</span>
          </h3>
          <div className={STYLE.divider} />
        </div>

        <div className={STYLE.sliderArea}>
          <button
            type="button"
            className={STYLE.arrowButton}
            aria-label="이전 제품 보기"
            onClick={() => scrollByCard("prev")}
          >
            ‹
          </button>

          <div
            ref={trackRef}
            className={`${STYLE.track} ${grabbing ? "cursor-grabbing select-none" : "cursor-grab"}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={handleTrackMouseLeave}
          >
            {[...products, ...products].map((item, index) => (
              <div key={`${item.id}-${index}`} data-product-card="true" className={STYLE.cardWrap}>
                <Link
                  href={`/products/${toProductPathId(item.id)}`}
                  className={STYLE.cardLink}
                  aria-label={`${item.brandKo} 상세페이지 이동`}
                  draggable={false}
                  onClick={handleCardClick}
                  onDragStart={handleNativeDragStart}
                >
                  <ProductBox item={item} />
                </Link>
              </div>
            ))}
          </div>

          <button
            type="button"
            className={STYLE.arrowButton}
            aria-label="다음 제품 보기"
            onClick={() => scrollByCard("next")}
          >
            ›
          </button>
        </div>

        <div className={STYLE.buttonWrap}>
          <Link href="/products">
            <MoreButton text="목록으로" size="L" mode="dark" icon="chevron-right" />
          </Link>
        </div>
      </div>
    </section>
  );
}