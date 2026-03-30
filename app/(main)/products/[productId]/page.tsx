import { notFound } from "next/navigation";
import ProductDetailTop from "@/components/products/ProductDetailTop";
import OtherProductsSlider from "@/components/products/OtherProductsSlider";
import {
  getProductByIdServer,
} from "@/lib/api/products";
import { supabaseServer } from "@/lib/supabase/server";

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
  const { productId } = await params;
  const numericId = Number(productId);
  
  if (isNaN(numericId)) {
    notFound();
  }

  const product = await getProductByIdServer(numericId, supabaseServer);

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
