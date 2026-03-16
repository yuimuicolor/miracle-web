"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

interface AboutSliderProps {
  slides: string[];
}

const AUTO_SLIDE_MS = 4000;

export default function AboutSlider({ slides }: AboutSliderProps) {
  const safeSlides = useMemo(
    () => (slides.length > 0 ? slides : ["/images/main-bg.png"]),
    [slides]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [interactionVersion, setInteractionVersion] = useState(0);
  const startXRef = useRef<number | null>(null);
  const wheelLockRef = useRef(false);
  const autoTimerRef = useRef<number | null>(null);

  const resetAutoSlide = () => {
    setInteractionVersion((prev) => prev + 1);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % safeSlides.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + safeSlides.length) % safeSlides.length);
  };

  useEffect(() => {
    if (autoTimerRef.current !== null) {
      window.clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }

    if (safeSlides.length <= 1 || isDragging) {
      return;
    }

    autoTimerRef.current = window.setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % safeSlides.length);
    }, AUTO_SLIDE_MS);

    return () => {
      if (autoTimerRef.current !== null) {
        window.clearTimeout(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    };
  }, [safeSlides.length, currentIndex, isDragging, interactionVersion]);

  useEffect(() => {
    if (currentIndex >= safeSlides.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, safeSlides.length]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    resetAutoSlide();
    startXRef.current = event.clientX;
    setIsDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (startXRef.current === null) {
      return;
    }

    const delta = event.clientX - startXRef.current;
    setDragOffset(delta);
  };

  const handlePointerEnd = () => {
    if (startXRef.current === null) {
      return;
    }

    if (dragOffset <= -50) {
      goNext();
    } else if (dragOffset >= 50) {
      goPrev();
    }

    resetAutoSlide();

    startXRef.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const rawDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

    if (Math.abs(rawDelta) < 20 || wheelLockRef.current) {
      return;
    }

    wheelLockRef.current = true;
    window.setTimeout(() => {
      wheelLockRef.current = false;
    }, 350);

    resetAutoSlide();

    if (rawDelta > 0) {
      goNext();
      return;
    }

    goPrev();
  };

  return (
    <div
      className="relative aspect-16/10 w-full select-none overflow-hidden border border-white/10 bg-[#0f0f0f] touch-pan-y cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      <div
        className="flex h-full"
        style={{
          transform: `translateX(calc(${-currentIndex * 100}% + ${dragOffset}px))`,
          transition: isDragging ? "none" : "transform 500ms ease",
        }}
      >
        {safeSlides.map((src, index) => (
          <div key={`${src}-${index}`} className="relative h-full min-w-full">
          <Image
            src={src}
            alt={`About slide ${index + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/30" />
          </div>
        ))}
      </div>

      <div className="absolute bottom-[1.2rem] left-1/2 z-10 flex -translate-x-1/2 items-center gap-[0.8rem]">
        {safeSlides.map((_, index) => (
          <button
            key={`dot-${index}`}
            type="button"
            aria-label={`${index + 1}번 슬라이드로 이동`}
            onClick={() => {
              setCurrentIndex(index);
              resetAutoSlide();
            }}
            className={
              currentIndex === index
                ? "h-[0.8rem] w-[0.8rem] rounded-full bg-white"
                : "h-[0.6rem] w-[0.6rem] rounded-full bg-white/45"
            }
          />
        ))}
      </div>
    </div>
  );
}
