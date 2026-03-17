import Link from "next/link";
import ZoomablePhotoCard from "@/components/gallery/ZoomablePhotoCard";
import { getGalleryImages, type GalleryImageItem } from "../../lib/galleryData";
import MoreButton from "../MoreButton";
import SectionTitle from "./common/SectionTitle";
import { HOME_CONTENT } from "@/lib/siteData";

const STYLE = {
  section: `w-full flex flex-col items-center
  px-[1.6rem] md:px-[4rem] lg:px-[8rem]
  pt-[10rem] md:pt-[14rem] lg:pt-[17rem]
  pb-[8rem] md:pb-[12rem] lg:pb-[8rem]
  bg-[url('/images/gallery-bg.png')] bg-cover bg-center bg-no-repeat`,
  content: `z-10 flex w-full flex-col items-center justify-center
    gap-[4rem] lg:gap-[6rem]
  `,
  grid: `mx-auto grid w-full max-w-[80rem]
    grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-2
    gap-[1.6rem] md:gap-[2rem] lg:gap-[4rem]
  `,
  buttonWrap: "flex justify-center",
};

export default function GallerySection() {
  const { gallerySection } = HOME_CONTENT;
  const galleryImages = getGalleryImages(6);

  return (
    <section className={STYLE.section}>
      <div className={STYLE.content}>
        <SectionTitle title={gallerySection.sectionTitle} color="white" />

        <div className={STYLE.grid}>
          {galleryImages.map((image: GalleryImageItem) => (
            <ZoomablePhotoCard key={image.src} src={image.src} alt={image.alt} />
          ))}
        </div>

        <div className={STYLE.buttonWrap}>
          <Link href="/gallery">
            <MoreButton text={gallerySection.moreButtonText} size="L" mode="light" />
          </Link>
        </div>
      </div>
    </section>
  );
}
