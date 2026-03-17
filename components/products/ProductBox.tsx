import Image from "next/image";
import { ProductItem } from "@/lib/productsData";

interface ProductBoxProps {
  item: ProductItem;
}

const STYLE = {
  card:
    "relative h-[30rem] w-[30rem] overflow-hidden border border-black/10 bg-[#d6d6d6] shadow-[2px_2px_10px_rgba(0,0,0,0.2)]",
  image: "object-cover",
  overlay: "absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/45",
  textWrap: "absolute bottom-[1.8rem] left-[1.8rem] flex flex-col",
  category:
    "font-noto text-[1.6rem] uppercase tracking-[0.13em] leading-[1.3] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]",
  name:
    "font-noto text-[4.0rem] tracking-[-0.03em] leading-[1.3] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]",
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
        sizes="(max-width: 767px) 75vw, (max-width: 1023px) 40vw, 24vw"
        className={STYLE.image}
      />
      <div className={STYLE.overlay} />

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
