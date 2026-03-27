import { notFound } from "next/navigation";
import ProductDetailTop from "@/components/products/ProductDetailTop";
import OtherProductsSlider from "@/components/products/OtherProductsSlider";
import {
  getProductById,
  getAllProducts,
} from "@/lib/api/products";

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
  const products = await getAllProducts();
  return products.map((product) => ({
    productId: product.id.toString(), // URL용 문자열로 변환
  }));
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { productId } = await params;
  const numericId = Number(productId);
  
  if (isNaN(numericId)) {
    notFound();
  }

  const product = await getProductById(numericId);

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
