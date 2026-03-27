import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { 
  ABOUT_PAGE_STYLE,
  ANCHOR_PADDING_TOP,
  SECTION_REVEAL,
  SECTION_REVEAL_EFFECT } from "@/lib/constants/aboutPage";
import { ABOUT_PAGE_CONTENT } from "@/lib/aboutUsData";
import { SectionHeading } from "./SharedAboutPage";

export default function AboutCertificatesSection() {
  const { certificates } = ABOUT_PAGE_CONTENT;

  return (
    <section id="certificates" style={{ paddingTop: ANCHOR_PADDING_TOP }}>
      <ScrollReveal
        className={ABOUT_PAGE_STYLE.sectionHeading}
        durationMs={SECTION_REVEAL.durationMs}
        threshold={SECTION_REVEAL.threshold}
        rootMargin={SECTION_REVEAL.rootMargin}
        {...SECTION_REVEAL_EFFECT}
      >
        <SectionHeading
          headingEn={certificates.headingEn}
          headingKo={certificates.headingKo}
          description={certificates.description}
        />
      </ScrollReveal>

      <div className={ABOUT_PAGE_STYLE.certificateGrid}>
        {certificates.items.map((cert, index) => (
          <ScrollReveal
            key={cert.id}
            as="article"
            className={ABOUT_PAGE_STYLE.certificateCard}
            delayMs={index * 65}
            durationMs={SECTION_REVEAL.durationMs}
            threshold={SECTION_REVEAL.threshold}
            rootMargin={SECTION_REVEAL.rootMargin}
            {...SECTION_REVEAL_EFFECT}
          >
            <div className={ABOUT_PAGE_STYLE.certificateImageRatio}>
              <Image
                src="/images/main-bg.png"
                alt={cert.title}
                fill
                sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 20vw"
                className={ABOUT_PAGE_STYLE.imageObj}
              />
            </div>
            <div className={ABOUT_PAGE_STYLE.certificateCaption}>
              <p className={ABOUT_PAGE_STYLE.certificateTitle}>{cert.title}</p>
              <p className={ABOUT_PAGE_STYLE.certificateDesc}>{cert.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}