import Link from "next/link";
import MoreButton from "../MoreButton";
import SectionTitle from "./common/SectionTitle";

const STYLE = {
  section: `flex flex-col items-center py-[8rem] justify-center size-full lg:h-screen bg-[url('/images/gallery-bg.png')] bg-cover bg-center bg-no-repeat`,
  content: `flex flex-col items-center justify-center size-full
    px-[1.6em] md:px-[4rem] md:px-[6rem]
    gap-[4rem] lg:gap-[6rem]
  `,
  grid: ` mx-auto grid size-full max-w-[800px]
    grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-2
    gap-[1.6rem] md:gap-[2rem] lg:gap-[4rem]
  `,
  gridItem: "aspect-square bg-gray-500",
  buttonWrap: "flex justify-center",
};

export default function GallerySection() {
  return (
    <section className={STYLE.section}>
      <div className={STYLE.content}>
        {/* 제목란 */}
        <SectionTitle title="Gallery" color="white" />

        {/* 사진 그리드 레이아웃 */}
        <div className={STYLE.grid}>
          {/* Placeholder for photos - 6 divs for 3x2 grid */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={STYLE.gridItem}></div>
          ))}
        </div>

        {/* 버튼 */}
        <div className={STYLE.buttonWrap}>
          <Link href="/gallery">
            <MoreButton text="전체보기" size="L" mode="light" />
          </Link>
        </div>
      </div>
    </section>
  );
}
