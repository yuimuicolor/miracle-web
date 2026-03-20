"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ZoomablePhotoCard from "@/components/gallery/ZoomablePhotoCard";
import ScrollReveal from "@/components/ScrollReveal";
import { HOME_REVEAL } from "@/components/sections/homeMotion";
import { getGalleryImages, type GalleryImageItem } from "../../lib/galleryData";
import MoreButton from "../MoreButton";
import SectionTitle from "./common/SectionTitle";
import { STATIC_ASSETS } from "@/lib/siteData";

const STYLE = {
  section: `
    w-full flex flex-col items-center bg-cover bg-center bg-no-repeat
    px-[1.6rem] pt-[10rem] pb-[8rem]

    md:px-[4rem] md:pt-[14rem] md:pb-[12rem]
    lg:px-[8rem] lg:pt-[17rem] lg:pb-[8rem] lg:min-h-screen
  `,
  content: `
    z-10 flex w-full flex-col items-center justify-center
    gap-[4rem]
    lg:gap-[6rem]
  `,
  grid: `
    mx-auto grid w-full max-w-[80rem]
    grid-cols-2 grid-rows-3 gap-[1.6rem]
    md:grid-cols-3 md:grid-rows-2 md:gap-[2rem]
    lg:gap-[4rem]
  `,
  buttonWrap: "flex justify-center",
};

export default function GallerySection() {
  const [galleryImages, setGalleryImages] = useState<GalleryImageItem[]>([]);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      const images = await getGalleryImages(6);
      setGalleryImages(images);
    };

    fetchGalleryImages();
  }, []);

  return (
    <section className={STYLE.section} style={{ backgroundImage: `url(${STATIC_ASSETS.galleryBg})` }}>
      <div className={STYLE.content}>
        <ScrollReveal className="w-full" {...HOME_REVEAL.sectionTitle}>
          <SectionTitle title="Gallery" color="white" />
        </ScrollReveal>

        <div className={STYLE.grid}>
          {galleryImages.map((image: GalleryImageItem, index) => (
            <ScrollReveal
              key={image.id}
              className="w-full"
              delayMs={index * 70}
              {...HOME_REVEAL.card}
            >
              <ZoomablePhotoCard
              src={image.src}
              alt={image.alt}
               />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal
          className={STYLE.buttonWrap}
          delayMs={180}
          {...HOME_REVEAL.button}
        >
          <Link href="/gallery">
            <MoreButton
              text="MORE"
              size="L"
              mode="light"
            />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
