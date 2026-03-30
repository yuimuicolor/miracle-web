import ScrollReveal from "@/components/ScrollReveal";
import {
  ABOUT_PAGE_STYLE,
  MARQUEE_REPEAT_COUNT,
  SECTION_REVEAL,
  SECTION_REVEAL_EFFECT,
} from "@/lib/constants/aboutPage";

const MARQUEE_TEXT = "Miracle - Innovation for Meaningful Change";

export default function AboutMarqueeSection() {
  return (
    <ScrollReveal
      className={ABOUT_PAGE_STYLE.marqueeSection}
      durationMs={SECTION_REVEAL.durationMs}
      threshold={SECTION_REVEAL.threshold}
      rootMargin={SECTION_REVEAL.rootMargin}
      {...SECTION_REVEAL_EFFECT}
    >
      <div className={ABOUT_PAGE_STYLE.marqueeTrack} aria-hidden="true">
        {[0, 1].map((setIndex) => (
          <div key={`marquee-set-${setIndex}`} className={ABOUT_PAGE_STYLE.marqueeSet}>
            {Array.from({ length: MARQUEE_REPEAT_COUNT }).map((_, chunkIndex) => (
              <span
                key={`marquee-${setIndex}-${chunkIndex}`}
                className={ABOUT_PAGE_STYLE.marqueeChunk}
              >
              {MARQUEE_TEXT}
              </span>
            ))}
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}