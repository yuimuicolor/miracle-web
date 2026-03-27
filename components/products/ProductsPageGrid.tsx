"use client";

import { useMemo, useState } from "react";
import MoreButton from "@/components/MoreButton";
import ProductsPageBox from "@/components/products/ProductsPageBox";
import ScrollReveal from "@/components/ScrollReveal";
import { HOME_REVEAL } from "@/components/sections/homeMotion";
import { ProductItem } from "@/lib/types/products";

interface ProductsPageGridProps {
  products: ProductItem[];
}

const PAGE_SIZE = 6;

const STYLE = {
  grid: `
    grid w-full grid-cols-1 gap-y-[4rem]
    md:grid-cols-2 md:gap-x-[1.6rem] md:gap-y-[4rem]
    lg:grid-cols-3 lg:gap-x-[6rem] lg:gap-y-[4rem]
  `,
  buttonWrap: "mt-[4rem] flex justify-center lg:mt-[6rem]",
};

export default function ProductsPageGrid({ products }: ProductsPageGridProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleProducts = useMemo(
    () => products.slice(0, visibleCount),
    [products, visibleCount],
  );

  const hasMore = visibleCount < products.length;

  return (
    <>
      <div className={STYLE.grid}>
        {visibleProducts.map((product, index) => (
          <ScrollReveal
            key={product.id}
            className="w-full"
            delayMs={(index % PAGE_SIZE) * 60}
            {...HOME_REVEAL.card}
          >
            <ProductsPageBox item={product} />
          </ScrollReveal>
        ))}
      </div>

      {hasMore ? (
        <ScrollReveal className={STYLE.buttonWrap} delayMs={120} {...HOME_REVEAL.button}>
          <MoreButton
            text="MORE"
            size="L"
            mode="dark"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
          />
        </ScrollReveal>
      ) : null}
    </>
  );
}
