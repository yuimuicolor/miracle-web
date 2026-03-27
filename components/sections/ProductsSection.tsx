"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ProductBox from "@/components/products/ProductBox";
import ScrollReveal from "@/components/ScrollReveal";
import { HOME_REVEAL } from "@/components/sections/homeMotion";
import MoreButton from "../MoreButton";
import SectionTitle from "./common/SectionTitle";
import { getAllProducts } from "@/lib/api/products";
import { ProductItem } from "@/lib/types/products";
import { useSettings } from "@/context/SiteSettingsContext";
import { useProductsSlider } from "@/hooks/useProductsSlider";
import { supabaseServer } from "@/lib/supabase/server";

const STYLE = {
  section: `
    w-full bg-bg-light
    px-[1.6rem] pt-[10rem] pb-[8rem]
    md:px-[4rem] md:pt-[14rem] md:pb-[12rem]
    lg:px-[8rem] lg:pt-[17rem] lg:pb-[8rem] lg:min-h-screen
  `,
  content: "mx-auto flex w-full flex-col gap-[6rem]",
  titleWrap: "flex flex-col gap-[0.8rem] md:gap-[0rem] lg:gap-[2rem]",
  subText: "font-noto text-[1.8rem] lg:text-[2rem] text-black",
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
  const [products, setProducts] = useState<ProductItem[]>([]);
  const settings = useSettings();

const {
    trackRef, grabbing, handleMouseDown, handleMouseMove, stopDrag,
    scrollByCard, isHoverPauseRef, dragMovedRef
  } = useProductsSlider(products.length, { isInfinite: true, autoScroll: true });

  useEffect(() => {
    getAllProducts().then(setProducts).catch(err => console.error("데이터 로딩 실패:", err));
  }, []);

  if (!settings) {
    return null;
  }

  return (
    <section className={STYLE.section}>
      <div className={STYLE.content}>
        <ScrollReveal className={STYLE.titleWrap} {...HOME_REVEAL.sectionTitle}>
          <SectionTitle title="Products" color="black" />
          <p className={STYLE.subText}>
            <strong className="font-bold">{settings?.brandUppercaseName}</strong>
            의 제품들을 소개합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal
          className={STYLE.sliderArea}
          delayMs={120}
          {...HOME_REVEAL.sectionBody}
        >
          <button
            type="button"
            className={`${STYLE.arrowButton}`}
            aria-label="이전 제품 보기"
            onClick={() => scrollByCard("prev")}
          >
            ‹
          </button>

          <div
            ref={trackRef}
            className={`${STYLE.track} ${grabbing ? "cursor-grabbing select-none" : "cursor-grab"}`}
            onMouseEnter={() => (isHoverPauseRef.current = true)}
            onMouseLeave={() => (isHoverPauseRef.current = false)}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDrag}
          >
            {[...products, ...products].map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                data-product-card="true"
                className={STYLE.cardWrap}
              >
                <Link
                  href={`/products/${item.id}`}
                  className={STYLE.cardLink}
                  aria-label={`${item.mainTitle} 상세페이지 이동`}
                  onClick={(e) => dragMovedRef.current && e.preventDefault()}
                  draggable={false}
                >
                  <ProductBox item={item} index={index} />
                </Link>
              </div>
            ))}
          </div>

          <button
            type="button"
            className={`${STYLE.arrowButton}`}
            aria-label="다음 제품 보기"
            onClick={() => scrollByCard("next")}
          >
            ›
          </button>
        </ScrollReveal>

        <ScrollReveal
          className={STYLE.buttonWrap}
          delayMs={220}
          {...HOME_REVEAL.button}
        >
          <Link href="/products">
            <MoreButton
              text="전체보기"
              size="L"
              mode="dark"
            />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
