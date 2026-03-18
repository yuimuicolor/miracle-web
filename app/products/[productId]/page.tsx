import { notFound } from "next/navigation";
import ProductDetailTop from "@/components/products/ProductDetailTop";
import OtherProductsSlider from "@/components/products/OtherProductsSlider";
import {
  PRODUCTS,
  getProductByPathId,
  toProductPathId,
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

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    productId: toProductPathId(product.id),
  }));
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { productId } = await params;
  const product = getProductByPathId(productId);

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
