"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MoreButton from "@/components/MoreButton";
import ProductBox from "./ProductBox";
import { ProductItem } from "@/lib/types/products";
import { getAllProducts } from "@/lib/api/products";
import { useProductsSlider } from "@/hooks/useProductsSlider";

const STYLE = {
  section: `
    w-full bg-bg-light
    pt-[8rem] md:pt-[10rem] lg:pt-[12rem]
  `,
  content: "mx-auto flex w-full flex-col gap-[4rem] md:gap-[5rem]",
  titleWrap: `
    flex gap-[2rem]
    flex-col
    md:flex-row md:items-center
  `,
  title: `
    shrink-0 font-gilda font-normal uppercase
    leading-[1.2] tracking-[-0.05em] text-black
    text-[3.2rem] md:text-[3.6rem] lg:text-[5.6rem]
  `,
  star: "leading-[1.2] text-point pl-[0.2em]",
  divider: `
    h-[0.1rem] bg-black
    w-full
    md:flex-1
  `,
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
  currentProductId: number;
}

export default function OtherProductsSlider({
  currentProductId,
}: OtherProductsSliderProps) {

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    trackRef,
    grabbing,
    handleMouseDown,
    handleMouseMove,
    stopDrag,
    handleCardClick,
    scrollByCard,
  } = useProductsSlider(products.length, { isInfinite: false, autoScroll: false });

  useEffect(() => {
    const fetchOtherProducts = async () => {
      try {
        const allData = await getAllProducts();
        const filtered = allData.filter((item:any) => item.id !== currentProductId);
        setProducts(filtered);
      } catch (error) {
        console.error("다른 상품 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOtherProducts();
  }, [currentProductId]);

  
  const handleNativeDragStart = (event: React.DragEvent<HTMLElement>) => {
  event.preventDefault();
};


  if (!loading && products.length === 0) return null;


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
            onMouseLeave={stopDrag}
          >
            {products.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                data-product-card="true"
                className={STYLE.cardWrap}
              >
                <Link
                  href={`/products/${item.id}`}
                  className={STYLE.cardLink}
                  aria-label={`${item.mainTitle} 상세페이지 이동`}
                  draggable={false}
                  onClick={handleCardClick}
                  onDragStart={handleNativeDragStart}
                >
                  <ProductBox item={item} index={index} />
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
            <MoreButton
              text="목록으로"
              size="L"
              mode="dark"
              icon="chevron-right"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
