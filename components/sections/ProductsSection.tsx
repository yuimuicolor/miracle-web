"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ProductBox from "@/components/products/ProductBox";
import MoreButton from "../MoreButton";
import SectionTitle from "./common/SectionTitle";
import { PRODUCTS } from "@/lib/productsData";
import { BRAND_DATA, HOME_CONTENT } from "@/lib/siteData";

const AUTO_SPEED = 1.21;

const STYLE = {
  section: `
    w-full min-h-screen bg-bg-light
    px-[1.6rem] pt-[10rem] pb-[8rem]
    md:px-[4rem] md:pt-[14rem] md:pb-[12rem]
    lg:px-[8rem] lg:pt-[17rem] lg:pb-[8rem]
  `,
  content: "mx-auto flex w-full flex-col gap-[6rem]",
  titleWrap: "flex flex-col gap-[0.8rem] md:gap-[0rem] lg:gap-[2rem]",
  subText: "font-noto text-[1.6rem] md:text-[1.8rem] lg:text-[2rem] text-black",
  sliderArea: "flex items-center gap-[1.6rem]",
  track: `
    no-scrollbar flex flex-1 overflow-x-auto py-[1.5rem]
    gap-[1.6rem]
    md:gap-[2rem]
  `,
  cardWrap: "w-[30rem] shrink-0",
  arrowButton:
    "shrink-0 text-[6rem] leading-none text-black/20 transition-colors hover:text-black/45",
  buttonWrap: "flex justify-center",
};

export default function ProductsSection() {
  const { productsSection } = HOME_CONTENT;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [grabbing, setGrabbing] = useState(false);

  const rafRef = useRef<number>(0);
  const halfRef = useRef(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const modeRef = useRef<"auto" | "momentum">("auto");
  const momentumVRef = useRef(0);
  const autoCarryRef = useRef(0);

  const calcHalf = (container: HTMLDivElement) => {
    const cards = container.querySelectorAll<HTMLElement>("[data-product-card='true']");
    halfRef.current = cards[PRODUCTS.length]?.offsetLeft ?? container.scrollWidth / 2;
  };

  useEffect(() => {
    const container = trackRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => calcHalf(container));
    ro.observe(container);

    const loop = () => {
      if (!isDragging.current) {
        const half = halfRef.current;
        if (half > 0) {
          if (modeRef.current === "momentum") {
            momentumVRef.current *= 0.86;
            if (Math.abs(momentumVRef.current) < 0.8) {
              modeRef.current = "auto";
              momentumVRef.current = 0;
              autoCarryRef.current = 0;
            } else {
              container.scrollLeft -= momentumVRef.current;
            }
          } else {
            autoCarryRef.current += AUTO_SPEED;
            const movePx = autoCarryRef.current >= 1 ? Math.floor(autoCarryRef.current) : 0;
            if (movePx > 0) {
              container.scrollLeft += movePx;
              autoCarryRef.current -= movePx;
            }
          }
          if (container.scrollLeft >= half) container.scrollLeft -= half;
          if (container.scrollLeft < 0) container.scrollLeft += half;
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    // 레이아웃 완료 후 half 계산 뒤 루프 시작
    requestAnimationFrame(() => {
      calcHalf(container);
      rafRef.current = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollByCard = (direction: "prev" | "next") => {
    const container = trackRef.current;
    if (!container) return;
    const firstCard = container.querySelector<HTMLElement>("[data-product-card='true']");
    if (!firstCard) return;
    const step = firstCard.offsetWidth + 16;
    const half = halfRef.current;
    let target = container.scrollLeft + (direction === "next" ? step : -step);
    if (target >= half) target -= half;
    if (target < 0) target += half;
    container.scrollLeft = target;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = trackRef.current;
    if (!container) return;
    isDragging.current = true;
    setGrabbing(true);
    dragStartX.current = e.pageX - container.getBoundingClientRect().left;
    dragScrollLeft.current = container.scrollLeft;
    lastXRef.current = e.pageX;
    lastTimeRef.current = Date.now();
    velocityRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const container = trackRef.current;
    if (!container) return;
    const half = halfRef.current;
    const x = e.pageX - container.getBoundingClientRect().left;
    const now = Date.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) velocityRef.current = ((e.pageX - lastXRef.current) / dt) * 14;
    lastXRef.current = e.pageX;
    lastTimeRef.current = now;
    let newLeft = dragScrollLeft.current - (x - dragStartX.current) * 1.8;
    if (newLeft >= half) newLeft -= half;
    if (newLeft < 0) newLeft += half;
    container.scrollLeft = newLeft;
  };

  const stopDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setGrabbing(false);
    momentumVRef.current = velocityRef.current;
    modeRef.current = "momentum";
  };

  return (
    <section className={STYLE.section}>
      <div className={STYLE.content}>
        <div className={STYLE.titleWrap}>
          <SectionTitle title={productsSection.sectionTitle} color="black" />
          <p className={STYLE.subText}>
            <strong className="font-bold">{BRAND_DATA.uppercaseName}</strong>{productsSection.description}
          </p>
        </div>

        <div className={STYLE.sliderArea}>
          <button
            type="button"
            className={`${STYLE.arrowButton}`}
            aria-label={productsSection.previousAriaLabel}
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
            onMouseLeave={stopDrag}
          >
            {[...PRODUCTS, ...PRODUCTS].map((item, index) => (
              <div key={index} data-product-card="true" className={STYLE.cardWrap}>
                <ProductBox item={item} />
              </div>
            ))}
          </div>

          <button
            type="button"
            className={`${STYLE.arrowButton}`}
            aria-label={productsSection.nextAriaLabel}
            onClick={() => scrollByCard("next")}
          >
            ›
          </button>
        </div>

        <div className={STYLE.buttonWrap}>
          <Link href="/products">
            <MoreButton text={productsSection.moreButtonText} size="L" mode="dark" />
          </Link>
        </div>
      </div>
    </section>
  );
}