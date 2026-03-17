import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PRODUCTS,
  getProductByPathId,
  toProductPathId,
} from "@/lib/productsData";

const STYLE = {
  section: `
    w-full min-h-screen bg-bg-light
    px-[1.6rem] pt-[10rem] pb-[8rem]
    md:px-[4rem] md:pt-[14rem] md:pb-[10rem]
    lg:px-[8rem] lg:pt-[17rem] lg:pb-[12rem]
  `,
  content: `
    mx-auto flex w-full max-w-[1200px] flex-col
    gap-[3.2rem]
    lg:gap-[4rem]
  `,
  backLink: `
    w-fit font-noto text-[1.6rem] text-black/70
    transition-colors duration-200 hover:text-hover
  `,
  titleWrap: "flex flex-col gap-[1.2rem]",
  titleRow: "flex items-end gap-[1.2rem]",
  brandKo: "font-noto text-[3.2rem] font-semibold leading-none tracking-[-0.04em] text-black",
  brandEn: "font-noto text-[2rem] font-medium leading-[1.3] tracking-[0.2em] uppercase text-black/80",
  imageWrap: "relative w-full overflow-hidden rounded-[1rem] aspect-[3/2]",
  desc: "font-noto text-[1.8rem] leading-[1.6] tracking-[-0.03em] text-black",
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
      <div className={STYLE.content}>
        <Link href="/products" className={STYLE.backLink}>
          ← PRODUCTS 목록으로
        </Link>

        <div className={STYLE.titleWrap}>
          <div className={STYLE.titleRow}>
            <h1 className={STYLE.brandKo}>{product.brandKo}</h1>
            <p className={STYLE.brandEn}>{product.brandEn}</p>
          </div>
          <p className={STYLE.desc}>{product.desc}</p>
        </div>

        <div className={STYLE.imageWrap}>
          <Image
            src={product.image}
            alt={product.brandKo}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 80vw, 1200px"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
