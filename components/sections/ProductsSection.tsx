"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ProductBox from "@/components/products/ProductBox";
import ScrollReveal from "@/components/ScrollReveal";
import { HOME_REVEAL } from "@/components/sections/homeMotion";
import MoreButton from "../MoreButton";
import SectionTitle from "./common/SectionTitle";
import { PRODUCTS, toProductPathId } from "@/lib/productsData";
import { BRAND_DATA, HOME_CONTENT } from "@/lib/siteData";

const AUTO_SPEED = 1;
const MOBILE_AUTO_SPEED = 0.5;

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
    no-scrollbar grid flex-1 grid-flow-col grid-rows-2 auto-cols-[30rem] overflow-x-auto overscroll-x-contain touch-pan-x py-[1.5rem]
    gap-[1.6rem]
    md:flex md:grid-flow-row md:grid-rows-none md:auto-cols-auto md:gap-[2rem]
  `,
  cardWrap: "w-[30rem] shrink-0",
  cardLink: "block",
  arrowButton:
    "shrink-0 text-[6rem] leading-none text-black/20 transition-colors hover:text-black/45",
  buttonWrap: "flex justify-center",
};

export default function ProductsSection() {
  const ARROW_SCROLL_DURATION = 420;

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
  const dragMovedRef = useRef(false);
  const isTrackHoveredRef = useRef(false);
  const isHoverPauseRef = useRef(false);
  const arrowAnimRef = useRef<number>(0);
  const autoScrollEnabledRef = useRef(true);
  const autoSpeedRef = useRef(AUTO_SPEED);

  const normalizeScroll = (value: number, half: number) => {
    if (half <= 0) return value;
    return ((value % half) + half) % half;
  };

  const calcHalf = (container: HTMLDivElement) => {
    const cards = container.querySelectorAll<HTMLElement>("[data-product-card='true']");
    halfRef.current = cards[PRODUCTS.length]?.offsetLeft ?? container.scrollWidth / 2;
  };

  useEffect(() => {
    const updateAutoSpeed = () => {
      const isMobileViewport = window.innerWidth < 768;
      autoSpeedRef.current = isMobileViewport ? MOBILE_AUTO_SPEED : AUTO_SPEED;
    };

    updateAutoSpeed();
    window.addEventListener("resize", updateAutoSpeed);

    return () => {
      window.removeEventListener("resize", updateAutoSpeed);
    };
  }, []);

  useEffect(() => {
    const container = trackRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => calcHalf(container));
    ro.observe(container);

    const loop = () => {
      if (!isDragging.current && !isHoverPauseRef.current) {
        const half = halfRef.current;
        if (half > 0) {
          if (modeRef.current === "momentum") {
            momentumVRef.current *= 0.86;
            if (Math.abs(momentumVRef.current) < 0.8) {
              modeRef.current = "auto";
              momentumVRef.current = 0;
              autoCarryRef.current = 0;
            } else {
              container.scrollLeft = normalizeScroll(
                container.scrollLeft - momentumVRef.current,
                half,
              );
            }
          } else if (autoScrollEnabledRef.current) {
            autoCarryRef.current += autoSpeedRef.current;
            const movePx = autoCarryRef.current >= 1 ? Math.floor(autoCarryRef.current) : 0;
            if (movePx > 0) {
              container.scrollLeft = normalizeScroll(
                container.scrollLeft + movePx,
                half,
              );
              autoCarryRef.current -= movePx;
            }
          }
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
      if (arrowAnimRef.current) {
        cancelAnimationFrame(arrowAnimRef.current);
      }
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    // 화살표를 누른 뒤에는 자동 흐름을 멈추고 수동 인터랙션 중심으로 전환한다.
    autoScrollEnabledRef.current = false;
    modeRef.current = "auto";
    momentumVRef.current = 0;
    autoCarryRef.current = 0;

    animateScrollBy(direction === "next" ? step : -step);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = trackRef.current;
    if (!container) return;
    stopArrowAnimation();
    isDragging.current = true;
    isHoverPauseRef.current = false;
    dragMovedRef.current = false;
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
    isHoverPauseRef.current = isTrackHoveredRef.current;
    momentumVRef.current = velocityRef.current;
    modeRef.current = "momentum";
  };

  const handleTrackMouseEnter = () => {
    isTrackHoveredRef.current = true;
    if (!isDragging.current) {
      isHoverPauseRef.current = true;
    }
  };

  const handleTrackMouseLeave = () => {
    isTrackHoveredRef.current = false;
    isHoverPauseRef.current = false;
    stopDrag();
  };

  return (
    <section className={STYLE.section}>
      <div className={STYLE.content}>
        <ScrollReveal className={STYLE.titleWrap} {...HOME_REVEAL.sectionTitle}>
          <SectionTitle title={productsSection.sectionTitle} color="black" />
          <p className={STYLE.subText}>
            <strong className="font-bold">{BRAND_DATA.uppercaseName}</strong>{productsSection.description}
          </p>
        </ScrollReveal>

        <ScrollReveal className={STYLE.sliderArea} delayMs={120} {...HOME_REVEAL.sectionBody}>
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
            onMouseEnter={handleTrackMouseEnter}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={handleTrackMouseLeave}
          >
            {[...PRODUCTS, ...PRODUCTS].map((item, index) => (
              <div key={index} data-product-card="true" className={STYLE.cardWrap}>
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
            className={`${STYLE.arrowButton}`}
            aria-label={productsSection.nextAriaLabel}
            onClick={() => scrollByCard("next")}
          >
            ›
          </button>
        </ScrollReveal>

        <ScrollReveal className={STYLE.buttonWrap} delayMs={220} {...HOME_REVEAL.button}>
          <Link href="/products">
            <MoreButton text={productsSection.moreButtonText} size="L" mode="dark" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}