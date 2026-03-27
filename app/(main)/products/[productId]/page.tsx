'use client';

import ProductDetailTop from "@/components/products/ProductDetailTop";
import OtherProductsSlider from "@/components/products/OtherProductsSlider";
import {
  getProductById,
} from "@/lib/api/products";
import React, { useEffect, useState } from "react";
import { ProductItem } from "@/lib/types/products";

const STYLE = {
  section: `
    w-full bg-bg-light
    px-[1.6rem]
    md:px-[4rem]
    lg:px-[8rem]
  `,
};

interface ProductDetailPageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);

  const { productId } = React.use(params);
  const numericId = Number(productId);

  useEffect(() => {
    if (isNaN(numericId)) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        // 누나가 쓰던 그 getProductById (/api/... fetch 방식) 그대로!
        const data = await getProductById(numericId);
        setProduct(data);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [numericId]);

  if (!product) {
    return <div>상품이 없습니다.</div>;
  }

  if (loading) {
    return <div className="py-[10rem] text-center">상품 정보를 불러오는 중입니다...</div>;
  }

  return (
    <section className={STYLE.section}>
      <ProductDetailTop product={product} />
      <OtherProductsSlider currentProductId={product.id} />
    </section>
  );
}
