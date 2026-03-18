import ScrollReveal from "@/components/ScrollReveal";
import {
  ABOUT_PAGE_STYLE,
  MARQUEE_REPEAT_COUNT,
  SECTION_REVEAL,
  SECTION_REVEAL_EFFECT,
} from "@/components/aboutus/aboutPageShared";
import { ABOUT_PAGE_CONTENT } from "@/lib/aboutPageData";

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
                {` ${ABOUT_PAGE_CONTENT.trustText} `}
              </span>
            ))}
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}