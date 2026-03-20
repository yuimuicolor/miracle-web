import { notFound } from "next/navigation";
import ProductDetailTop from "@/components/products/ProductDetailTop";
import OtherProductsSlider from "@/components/products/OtherProductsSlider";
import {
  getProductByPathId,
  toProductPathId,
  getAllProducts, // 1. 모든 상품 가져오는 함수 추가
} from "@/lib/productsData";

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

export async function generateStaticParams() {
  const products = await getAllProducts(); // DB에서 모든 상품 리스트 가져오기
  
  return products.map((product) => ({
    productId: toProductPathId(product.id),
  }));
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { productId } = await params;
  const product = await getProductByPathId(productId);

  if (!product) {
    notFound();
  }
  
  return (
    <section className={STYLE.section}>
      <ProductDetailTop product={product} />
      <OtherProductsSlider currentProductId={product.id} />
    </section>
  );
}
