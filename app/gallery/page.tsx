import GalleryPageGrid from "../../components/gallery/GalleryPageGrid";
import ScrollReveal from "@/components/ScrollReveal";
import { HOME_REVEAL } from "@/components/sections/homeMotion";
import SectionTitle from "@/components/sections/common/SectionTitle";
import { getGalleryImages } from "../../lib/galleryData";
import { HOME_CONTENT } from "@/lib/siteData";

const STYLE = {
  section: `
    relative flex w-full flex-col items-center overflow-hidden bg-bg-dark
  `,
  bgImage: `absolute inset-0 bg-[url('/images/gallery-bg.png')] bg-cover bg-center bg-no-repeat`,
  bgOverlay: `absolute inset-0 bg-black/70 backdrop-blur-[60px]`,
  content: `relative z-10 flex w-full flex-col items-center justify-center
    px-[1.6em] gap-[4rem]
    md:px-[4rem]
    lg:px-[6rem] lg:gap-[6rem]
  `,
};

export default function GalleryPage() {
  const { gallerySection } = HOME_CONTENT;
  const galleryImages = getGalleryImages();

  return (
    <section className={STYLE.section}>
      <div className={STYLE.bgImage} />
      <div className={STYLE.bgOverlay} />
      <div className={STYLE.content}>
        <ScrollReveal className="w-full" {...HOME_REVEAL.sectionTitle}>
          <SectionTitle title={gallerySection.sectionTitle} color="white" />
        </ScrollReveal>
        <ScrollReveal className="w-full" delayMs={120} {...HOME_REVEAL.sectionBody}>
          <GalleryPageGrid images={galleryImages} />
        </ScrollReveal>
      </div>
    </section>
  );
}
