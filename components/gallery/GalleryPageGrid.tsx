"use client";

import { useMemo, useState } from "react";
import MoreButton from "@/components/MoreButton";
import ZoomablePhotoCard from "@/components/gallery/ZoomablePhotoCard";

interface GalleryPageGridItem {
  src: string;
  alt: string;
  subtitle: string;
  mainTitle: string;
}

interface GalleryPageGridProps {
  images: GalleryPageGridItem[];
}

const PAGE_SIZE = 6;

const STYLE = {
  grid: `mx-auto grid w-full max-w-[1200px]
    grid-cols-2 md:grid-cols-3
    gap-[1.6rem] md:gap-[2rem] lg:gap-[4rem]
  `,
  buttonWrap: "flex justify-center",
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
        {visibleImages.map((image) => (
          <ZoomablePhotoCard
            key={image.src}
            src={image.src}
            alt={image.alt}
            mode="with-title"
            subtitle={image.subtitle}
            mainTitle={image.mainTitle}
          />
        ))}
      </div>

      {hasMore ? (
        <div className={STYLE.buttonWrap}>
          <MoreButton
            text="더보기"
            size="L"
            mode="light"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
          />
        </div>
      ) : null}
    </>
  );
}