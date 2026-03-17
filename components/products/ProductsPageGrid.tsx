"use client";

import { useMemo, useState } from "react";
import MoreButton from "@/components/MoreButton";
import ProductsPageBox from "@/components/products/ProductsPageBox";
import type { ProductItem } from "@/lib/productsData";

interface ProductsPageGridProps {
  products: ProductItem[];
}

const PAGE_SIZE = 6;

const STYLE = {
  grid: `
    grid w-full grid-cols-1
    gap-y-[4rem]
    md:grid-cols-2 md:gap-x-[1.6rem] md:gap-y-[4rem]
    lg:grid-cols-3 lg:gap-x-[6rem] lg:gap-y-[4rem]
  `,
  buttonWrap: "flex justify-center",
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
        {visibleProducts.map((product) => (
          <ProductsPageBox key={product.id} item={product} />
        ))}
      </div>

      {hasMore ? (
        <div className={STYLE.buttonWrap}>
          <MoreButton
            text="MORE"
            size="L"
            mode="dark"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
          />
        </div>
      ) : null}
    </>
  );
}
