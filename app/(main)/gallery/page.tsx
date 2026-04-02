"use client"; 

import { useEffect, useState } from "react"; //
import GalleryPageGrid from "../../../components/gallery/GalleryPageGrid";
import ScrollReveal from "@/components/ScrollReveal";
import { HOME_REVEAL } from "@/components/sections/homeMotion";
import SectionTitle from "@/components/sections/common/SectionTitle";
import { getGalleryImages } from "@/lib/api/gallery";
import { GalleryItem } from "@/lib/types/gallery";

const STYLE = {
  section: `
    relative flex w-full flex-col items-center overflow-hidden bg-bg-dark
  `,
  bgImage: `absolute inset-0 bg-black bg-cover bg-center bg-no-repeat`,
  bgOverlay: `absolute inset-0 bg-black/70 backdrop-blur-[60px]`,
  content: `relative z-10 flex w-full flex-col items-center justify-center
    px-[1.6em] gap-[4rem]
    md:px-[4rem]
    lg:px-[6rem] lg:gap-[6rem]
  `,
};

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const fetchAllImages = async () => {
      const data = await getGalleryImages(); 
      setGalleryImages(data);
    };
    fetchAllImages();
  }, []);

return (
    <section className={STYLE.section}>
      <div className={STYLE.bgImage} />
      <div className={STYLE.bgOverlay} />
      
      <div className={STYLE.content}>
        {/* 섹션 타이틀 */}
        <ScrollReveal className="w-full" {...HOME_REVEAL.sectionTitle}>
          <SectionTitle title="Gallery" color="white" />
        </ScrollReveal>

        {/* 갤러리 그리드 - 데이터가 로드된 후에만 렌더링 */}
        <ScrollReveal className="w-full" delayMs={120} {...HOME_REVEAL.sectionBody}>
          {galleryImages.length > 0 ? (
            <GalleryPageGrid images={galleryImages} />
          ) : (
            <div className="text-white/50 py-[10rem]">사진을 불러오는 중입니다...</div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
