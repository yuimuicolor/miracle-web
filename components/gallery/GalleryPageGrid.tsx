"use client";

import { useMemo, useState } from "react";
import MoreButton from "@/components/MoreButton";
import ScrollReveal from "@/components/ScrollReveal";
import ZoomablePhotoCard from "@/components/gallery/ZoomablePhotoCard";
import { HOME_REVEAL } from "@/components/sections/homeMotion";
import { GalleryPageGridProps } from "@/lib/types/gallery";

const PAGE_SIZE = 6;

const STYLE = {
  grid: `grid w-full
    grid-cols-2 gap-[1.6rem]
    md:grid-cols-3 md:gap-[2rem]
    lg:gap-[4rem]
  `,
  buttonWrap: "mt-[4rem] flex justify-center lg:mt-[6rem]",
};

export default function GalleryPageGrid({ images }: GalleryPageGridProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleImages = useMemo(
    () => images.slice(0, visibleCount),
    [images, visibleCount],
  );

  const hasMore = visibleCount < images.length;

  return (
    <>
      <div className={STYLE.grid}>
        {visibleImages.map((image, index) => (
          <ScrollReveal
            key={image.imageUrl}
            className="w-full"
            delayMs={(index % PAGE_SIZE) * 60}
            {...HOME_REVEAL.card}
          >
            <ZoomablePhotoCard
              src={image.imageUrl}
              alt={image.mainTitle}
              mode="with-title"
              subtitle={image.subtitle}
              mainTitle={image.mainTitle}
            />
          </ScrollReveal>
        ))}
      </div>

      {hasMore ? (
        <ScrollReveal className={STYLE.buttonWrap} delayMs={120} {...HOME_REVEAL.button}>
          <MoreButton
            text="MORE"
            size="L"
            mode="light"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
          />
        </ScrollReveal>
      ) : null}
    </>
  );
}