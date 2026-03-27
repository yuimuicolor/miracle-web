import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { ProductItem } from "@/lib/types/products";

interface ProductsPageBoxProps {
  item: ProductItem;
}

const TWO_LINE_CLAMP_STYLE = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical" as const,
  overflow: "hidden",
};

const STYLE = {
  card: "group flex w-full flex-col gap-[1.2rem]",
  imageWrap: "relative aspect-[3/2] w-full overflow-hidden rounded-[0.8rem]",
  image: "object-cover",
  hoverOverlay: `
    pointer-events-none absolute inset-0 bg-hover/70 backdrop-blur-[4px]
    opacity-0 transition-opacity duration-300
    group-hover:opacity-100
  `,
  hoverLabelWrap: `
    pointer-events-none absolute inset-0 z-[2]
    flex flex-col items-center justify-center
    opacity-0 transition-opacity duration-300
    group-hover:opacity-100
  `,
  hoverPlus: "font-noto text-[3rem] leading-none text-white",
  hoverMore: "font-noto text-[2rem] leading-[1.3] tracking-[0.2em] text-white",
  titleRow: "flex items-center justify-between",
  titleTextWrap: `
    flex items-center gap-[1.2rem] text-black
    transition-colors duration-300
    group-hover:text-hover
  `,
  mainTitle:
    "font-noto font-semibold text-[2rem] leading-none tracking-[-0.04em]",
  subTitle:
    "font-noto font-medium text-[1.8rem] leading-[1.3] tracking-[0.2em] uppercase",
  plusButton: `
    flex h-[2rem] w-[2rem] items-center justify-center text-black
    transition-all duration-300
    group-hover:rotate-90 group-hover:text-hover
  `,
  divider: `
    h-px w-full bg-black
    transition-colors duration-300
    group-hover:bg-hover
  `,
  desc: `
    font-noto font-medium text-[1.8rem] xl:text-[1.8rem] leading-[1.5] tracking-[-0.05em] text-black
    transition-colors duration-300
    group-hover:text-hover
  `,
};

export default function ProductsPageBox({ item }: ProductsPageBoxProps) {
  const productPath = `/products/${item.id}`;

  return (
    <Link href={productPath} aria-label={`${item.mainTitle} 상세페이지 이동`}>
      <article className={STYLE.card}>
        <div className={STYLE.imageWrap}>
          <Image
            src={item.image}
            alt={item.mainTitle}
            fill
            unoptimized={true}
            loading="eager"
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className={STYLE.image}
          />
          <div className={STYLE.hoverOverlay} />
          <div className={STYLE.hoverLabelWrap}>
            <span className={STYLE.hoverPlus}>+</span>
            <span className={STYLE.hoverMore}>MORE</span>
          </div>
        </div>

        <div className={STYLE.titleRow}>
          <div className={STYLE.titleTextWrap}>
            <p className={STYLE.mainTitle}>{item.mainTitle}</p>
            <p className={STYLE.subTitle}>{item.subTitle}</p>
          </div>

          <span aria-hidden="true" className={STYLE.plusButton}>
            <Plus size={20} />
          </span>
        </div>

        <div className={STYLE.divider} />

        <p className={STYLE.desc} style={TWO_LINE_CLAMP_STYLE}>
          {item.desc}
        </p>
      </article>
    </Link>
  );
}
