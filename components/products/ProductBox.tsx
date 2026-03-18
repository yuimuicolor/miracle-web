import Image from "next/image";
import { Plus } from "lucide-react";
import { ProductItem } from "@/lib/productsData";

interface ProductBoxProps {
  item: ProductItem;
}

const STYLE = {
  card: `
    group relative h-[30rem] w-full overflow-hidden
    border border-black/10 bg-[#d6d6d6]
    shadow-[2px_2px_10px_rgba(0,0,0,0.2)]
  `,
  image: "object-cover transition-[filter] duration-300 ease-out group-hover:blur-[4px]",
  overlay: "absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/45 transition-opacity duration-300",
  hoverTint:
    "pointer-events-none absolute inset-0 z-[2] bg-hover/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
  plusWrap:
    "pointer-events-none absolute right-[2rem] top-[2rem] z-[5] flex h-[6rem] w-[6rem] items-center justify-center rounded-full bg-white/85 text-hover opacity-0 transition-all duration-300 group-hover:opacity-100",
  textWrap: "absolute bottom-[1.8rem] left-[1.8rem] flex flex-col",
  category: `
    font-noto text-[1.8rem] uppercase leading-[1.3] tracking-[0.13em] text-white
    drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]
    transition-opacity duration-300 group-hover:opacity-90
  `,
  name: `
    font-noto text-[4.0rem] leading-[1.3] tracking-[-0.03em] text-white
    drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]
  `,
};

const TWO_LINE_CLAMP_STYLE = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical" as const,
  overflow: "hidden",
};

export default function ProductBox({ item }: ProductBoxProps) {
  return (
    <article className={STYLE.card}>
      <Image
        src={item.image}
        alt={item.brandKo}
        fill
        draggable={false}
        sizes="(max-width: 767px) 75vw, (max-width: 1023px) 40vw, 24vw"
        className={STYLE.image}
      />
      <div className={STYLE.overlay} />
      <div className={STYLE.hoverTint} />
      <div className={STYLE.plusWrap}>
        <Plus size={38} strokeWidth={2.2} />
      </div>

      <div className={STYLE.textWrap}>
        <p className={STYLE.category} style={TWO_LINE_CLAMP_STYLE}>
          {item.brandEn}
        </p>
        <p className={STYLE.name} style={TWO_LINE_CLAMP_STYLE}>
          {item.brandKo}
        </p>
      </div>
    </article>
  );
}
