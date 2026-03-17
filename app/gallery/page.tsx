import GalleryPageGrid from "../../components/gallery/GalleryPageGrid";
import SectionTitle from "@/components/sections/common/SectionTitle";
import { getGalleryImages } from "../../lib/galleryData";

const STYLE = {
  section: `relative flex w-full flex-col items-center overflow-hidden bg-bg-dark`,
  bgImage: `absolute inset-0 bg-[url('/images/gallery-bg.png')] bg-cover bg-center bg-no-repeat`,
  bgOverlay: `absolute inset-0 bg-black/70 backdrop-blur-[60px]`,
  content: `relative z-10 flex w-full flex-col items-center justify-center
    px-[1.6em] md:px-[4rem] lg:px-[6rem]
    gap-[4rem] lg:gap-[6rem]
  `,
};

export default function GalleryPage() {
  const galleryImages = getGalleryImages();

  return (
    <section className={STYLE.section}>
      <div className={STYLE.bgImage} />
      <div className={STYLE.bgOverlay} />
      <div className={STYLE.content}>
        <SectionTitle title="Gallery" color="white" />
        <GalleryPageGrid images={galleryImages} />
      </div>
    </section>
  );
}
